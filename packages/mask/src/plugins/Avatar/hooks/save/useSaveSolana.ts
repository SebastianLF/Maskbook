import { useWeb3Connection } from '@masknet/plugin-infra/web3'
import type { BindingProof, ECKeyIdentifier, ProfileIdentifier } from '@masknet/shared-base'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import type { ChainId } from '@masknet/web3-shared-evm'
import { useAsyncFn } from 'react-use'
import { activatedSocialNetworkUI } from '../../../../social-network'
import { PluginNFTAvatarRPC } from '../../messages'
import type { NextIDAvatarMeta } from '../../types'

export function useSaveSolana(pluginId: NetworkPluginID, chainId: ChainId) {
    const connection = useWeb3Connection(pluginId, { chainId })
    return useAsyncFn(
        async (
            info: NextIDAvatarMeta,
            account: string,
            persona: ECKeyIdentifier,
            identifier: ProfileIdentifier,
            proof: BindingProof,
        ) => {
            const sign = await connection.signMessage(JSON.stringify(info), 'personaSign', {
                account,
            })
            return PluginNFTAvatarRPC.saveAvatar(
                account,
                activatedSocialNetworkUI.networkIdentifier,
                info,
                sign.toString(),
            )
        },
        [connection],
    )
}
