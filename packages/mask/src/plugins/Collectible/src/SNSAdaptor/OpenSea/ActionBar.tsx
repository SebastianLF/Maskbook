import { Box } from '@mui/material'
import { makeStyles, ActionButton } from '@masknet/theme'
import { useChainContext } from '@masknet/web3-hooks-base'
import type { Web3Helper } from '@masknet/web3-helpers'
import { isSameAddress } from '@masknet/web3-shared-base'
import type { NetworkPluginID } from '@masknet/shared-base'
import { useI18N } from '../../../../../utils/index.js'
import { useControlledDialog } from '../../../../../utils/hooks/useControlledDialog.js'
import { MakeOfferDialog } from './MakeOfferDialog.js'
import { PostListingDialog } from './PostListingDialog.js'
import { CheckoutDialog } from './CheckoutDialog.js'
import { ChainBoundary } from '@masknet/shared'
import { useAssetOrder } from './hooks/useAssetOrder.js'
import { Context } from '../Context/index.js'

const useStyles = makeStyles()((theme) => {
    return {
        root: {
            width: 'calc(100% - 24px)',
            gap: 8,
        },
    }
})

export interface ActionBarProps {
    chainId: Web3Helper.ChainIdAll
    pluginID: NetworkPluginID
}

export function ActionBar({ chainId, pluginID }: ActionBarProps) {
    const { t } = useI18N()
    const { classes } = useStyles()
    const { asset } = Context.useContainer()
    const { account } = useChainContext()
    const { value: assetOrder } = useAssetOrder(asset.value?.address, asset.value?.tokenId)

    const {
        open: openCheckoutDialog,
        onOpen: onOpenCheckoutDialog,
        onClose: onCloseCheckoutDialog,
    } = useControlledDialog()
    const { open: openOfferDialog, onOpen: onOpenOfferDialog, onClose: onCloseOfferDialog } = useControlledDialog()
    const {
        open: openListingDialog,
        onOpen: onOpenListingDialog,
        onClose: onCloseListingDialog,
    } = useControlledDialog()

    if (!asset.value) return null
    const isOwner = isSameAddress(asset.value.owner?.address, account)
    return (
        <Box className={classes.root} sx={{ padding: 1.5 }} display="flex" justifyContent="center">
            <ChainBoundary
                expectedPluginID={pluginID}
                expectedChainId={chainId}
                ActionButtonPromiseProps={{ variant: 'roundedDark' }}>
                {!isOwner && asset.value.auction ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenCheckoutDialog}>
                        {t('plugin_collectible_buy_now')}
                    </ActionButton>
                ) : null}
                {!isOwner && asset.value.auction ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenOfferDialog}>
                        {t('plugin_collectible_place_bid')}
                    </ActionButton>
                ) : null}

                {!isOwner && !asset.value.auction ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenOfferDialog}>
                        {t('plugin_collectible_make_offer')}
                    </ActionButton>
                ) : null}
                {isOwner ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenListingDialog}>
                        {t('plugin_collectible_sell')}
                    </ActionButton>
                ) : null}
                <CheckoutDialog
                    asset={asset.value}
                    order={assetOrder}
                    open={openCheckoutDialog}
                    onClose={onCloseCheckoutDialog}
                />
                <PostListingDialog asset={asset.value} open={openListingDialog} onClose={onCloseListingDialog} />
                <MakeOfferDialog
                    asset={asset.value}
                    order={assetOrder}
                    open={openOfferDialog}
                    onClose={onCloseOfferDialog}
                />
            </ChainBoundary>
        </Box>
    )
}
