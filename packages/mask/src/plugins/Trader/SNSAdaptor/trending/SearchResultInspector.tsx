import { EMPTY_LIST, NetworkPluginID } from '@masknet/shared-base'
import { Web3ContextProvider, useAddressType } from '@masknet/web3-hooks-base'
import { AddressType, ChainId } from '@masknet/web3-shared-evm'
import { useAvailableDataProviders } from '../../trending/useAvailableDataProviders.js'
import { TrendingView } from './TrendingView.js'
import { usePayloadFromTokenSearchKeyword } from '../../trending/usePayloadFromTokenSearchKeyword.js'

export interface SearchResultInspectorProps {
    keyword: string
}

export function SearchResultInspector({ keyword }: SearchResultInspectorProps) {
    const { name, type, presetDataProviders, chainId, searchedContractAddress } = usePayloadFromTokenSearchKeyword(
        NetworkPluginID.PLUGIN_EVM,
        keyword,
    )
    const { value: addressType } = useAddressType(NetworkPluginID.PLUGIN_EVM, keyword, {
        chainId: chainId ?? ChainId.Mainnet,
    })

    const { value: dataProviders_ = EMPTY_LIST } = useAvailableDataProviders(type, name)
    const dataProviders = presetDataProviders ?? dataProviders_
    if (!name || name === 'UNKNOWN' || addressType === AddressType.ExternalOwned || !dataProviders?.length) return null
    return (
        <Web3ContextProvider value={{ pluginID: NetworkPluginID.PLUGIN_EVM, chainId: ChainId.Mainnet }}>
            <TrendingView
                isPopper={false}
                name={name}
                tagType={type}
                expectedChainId={chainId}
                searchedContractAddress={searchedContractAddress}
                dataProviders={dataProviders}
            />
        </Web3ContextProvider>
    )
}
