import type { ExchangeProxy } from '@masknet/web3-contracts/types/ExchangeProxy.js'
import { GasOptionConfig, useTraderConstants, encodeContractTransaction } from '@masknet/web3-shared-evm'
import { useAsyncFn } from 'react-use'
import { SLIPPAGE_DEFAULT } from '../../constants/index.js'
import { SwapResponse, TradeComputed, TradeStrategy } from '../../types/index.js'
import { useChainContext, useNetworkContext, useWeb3Connection, useWeb3State } from '@masknet/web3-hooks-base'
import { NetworkPluginID } from '@masknet/shared-base'
import { useTradeAmount } from './useTradeAmount.js'

export function useTradeCallback(
    trade: TradeComputed<SwapResponse> | null,
    exchangeProxyContract: ExchangeProxy | null,
    allowedSlippage = SLIPPAGE_DEFAULT,
    gasConfig?: GasOptionConfig,
) {
    const { account, chainId } = useChainContext()
    const { pluginID } = useNetworkContext()
    const { Others } = useWeb3State()
    const { BALANCER_ETH_ADDRESS } = useTraderConstants(chainId)
    const connection = useWeb3Connection()
    const tradeAmount = useTradeAmount(trade, allowedSlippage)

    return useAsyncFn(async () => {
        if (
            !connection ||
            !trade ||
            !trade.inputToken ||
            !trade.outputToken ||
            !exchangeProxyContract ||
            !BALANCER_ETH_ADDRESS ||
            pluginID !== NetworkPluginID.PLUGIN_EVM
        ) {
            return
        }

        const {
            swaps: [swaps],
        } = trade.trade_ as SwapResponse

        // cast the type to ignore the different type which was generated by typechain
        const swap_: Parameters<ExchangeProxy['methods']['multihopBatchSwapExactIn']>[0] = swaps.map((x) =>
            x.map(
                (y) =>
                    [
                        y.pool,
                        y.tokenIn,
                        y.tokenOut,
                        y.swapAmount,
                        y.limitReturnAmount,
                        y.maxPrice, // uint maxPrice
                    ] as [string, string, string, string, string, string],
            ),
        )

        // balancer use a different address for the native token
        const inputTokenAddress = Others?.isNativeTokenSchemaType(trade.inputToken.schema)
            ? BALANCER_ETH_ADDRESS
            : trade.inputToken.address
        const outputTokenAddress = Others?.isNativeTokenSchemaType(trade.outputToken.schema)
            ? BALANCER_ETH_ADDRESS
            : trade.outputToken.address

        // trade with the native token
        let transactionValue = '0'
        if (trade.strategy === TradeStrategy.ExactIn && Others?.isNativeTokenSchemaType(trade.inputToken.schema))
            transactionValue = trade.inputAmount.toFixed()
        else if (trade.strategy === TradeStrategy.ExactOut && Others?.isNativeTokenSchemaType(trade.outputToken.schema))
            transactionValue = trade.outputAmount.toFixed()

        // send transaction and wait for hash
        const config = {
            from: account,
            value: transactionValue,
            ...gasConfig,
        }

        const tx = await encodeContractTransaction(
            exchangeProxyContract,
            trade.strategy === TradeStrategy.ExactIn
                ? exchangeProxyContract.methods.multihopBatchSwapExactIn(
                      swap_,
                      inputTokenAddress,
                      outputTokenAddress,
                      trade.inputAmount.toFixed(),
                      tradeAmount.toFixed(),
                  )
                : exchangeProxyContract.methods.multihopBatchSwapExactOut(
                      swap_,
                      inputTokenAddress,
                      outputTokenAddress,
                      tradeAmount.toFixed(),
                  ),
            config,
        )

        // send transaction and wait for hash
        const hash = await connection.sendTransaction(tx, { chainId })
        const receipt = await connection.getTransactionReceipt(hash)

        return receipt?.transactionHash
    }, [
        chainId,
        trade,
        tradeAmount,
        exchangeProxyContract,
        BALANCER_ETH_ADDRESS,
        connection,
        pluginID,
        Others?.isNativeTokenSchemaType,
    ])
}
