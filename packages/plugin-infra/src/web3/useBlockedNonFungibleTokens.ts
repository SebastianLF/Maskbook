import { useMemo } from 'react'
import { useSubscription } from 'use-subscription'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import type { Web3Helper } from '@masknet/web3-helpers'
import { useWeb3State } from './useWeb3State.js'
import { EMPTY_ARRAY } from '../utils/subscription.js'

export function useBlockedNonFungibleTokens<S extends 'all' | void = void, T extends NetworkPluginID = NetworkPluginID>(
    pluginID?: T,
    schemaType?: Web3Helper.SchemaTypeScope<S, T>,
) {
    const { Token } = useWeb3State(pluginID)
    const nonFungibleTokens = useSubscription(Token?.blockedNonFungibleTokens ?? EMPTY_ARRAY)
    return useMemo<Array<Web3Helper.NonFungibleTokenScope<S, T>>>(() => {
        return nonFungibleTokens.length && schemaType
            ? nonFungibleTokens.filter((x) => x.schema === schemaType)
            : nonFungibleTokens
    }, [schemaType, nonFungibleTokens])
}
