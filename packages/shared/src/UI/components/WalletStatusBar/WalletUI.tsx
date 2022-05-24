import {
    NetworkPluginID,
    useCurrentWeb3NetworkPluginID,
    useNetworkDescriptor,
    useProviderDescriptor,
    useReverseAddress,
    useWeb3State,
} from '@masknet/plugin-infra/web3'
import { WalletIcon } from '@masknet/shared'
import { makeStyles } from '@masknet/theme'
import { formatEthereumAddress, useChainColor } from '@masknet/web3-shared-evm'
import { Box, CircularProgress, Link, Typography } from '@mui/material'
import Color from 'color'
import { useState } from 'react'
import { DownIcon } from '../../assets/Down'
import { LinkIcon } from '../../assets/Link'
import { LockWalletIcon } from '../../assets/Lock'
import { VerifyIcon } from '../../assets/verify'

const useStyles = makeStyles<{ filterColor: string }>()((theme, props) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    address: {
        display: 'flex',
        alignItems: 'center',
    },
    domain: {
        marginLeft: 9.53,
    },
    link: {
        lineHeight: 0,
        marginLeft: 4,
    },
    linkIcon: {
        width: 14,
        height: 14,
        fill: theme.palette.mode === 'dark' ? '#c4c7cd' : '#767f8d',
    },
    name: {
        display: 'flex',
    },
    pending: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 177, 0, 0.1)',
    },
    icon: {
        filter: `drop-shadow(0px 6px 12px ${new Color(props.filterColor).alpha(0.4).toString()})`,
    },
    walletName: {
        color: theme.palette.mode === 'dark' ? '#D9D9D9' : '#0F1419',
    },
    walletAddress: {
        color: theme.palette.mode === 'dark' ? '#6E767D' : '#536471',
    },
}))

interface WalletUIProps {
    address: string
    iconSize?: number
    badgeSize?: number
    onClick?: () => void
    verify?: boolean
    isETH?: boolean
    showMenuDrop?: boolean
}

export function WalletUI(props: WalletUIProps) {
    const {
        iconSize = 30,
        badgeSize = 12,
        onClick,
        verify = false,
        isETH = false,
        address,
        showMenuDrop = false,
    } = props
    const chainColor = useChainColor()
    const { classes } = useStyles({ filterColor: chainColor })
    const { Utils } = useWeb3State()

    const networkDescriptor = useNetworkDescriptor()
    const providerDescriptor = useProviderDescriptor()
    const [pending, setPending] = useState(false)
    const [lock, setLock] = useState(false)
    const currentPluginId = useCurrentWeb3NetworkPluginID()
    const { value: domain } = useReverseAddress(address, NetworkPluginID.PLUGIN_EVM)

    return (
        <Box className={classes.root} onClick={onClick}>
            <WalletIcon
                classes={{ root: classes.icon }}
                size={iconSize}
                badgeSize={badgeSize}
                networkIcon={providerDescriptor?.icon}
                providerIcon={networkDescriptor?.icon}
                isBorderColorNotDefault
            />
            <Box className={classes.domain}>
                <Box className={classes.name}>
                    <Typography className={classes.walletName} fontWeight={700} fontSize={14}>
                        {currentPluginId === NetworkPluginID.PLUGIN_EVM
                            ? domain ?? Utils?.formatAddress?.(address, 4)
                            : Utils?.formatAddress?.(address, 4)}
                    </Typography>
                    {verify ? <VerifyIcon style={{ width: 14, height: 14, marginLeft: 4 }} /> : null}
                    {showMenuDrop ? <DownIcon /> : null}
                </Box>
                <Box className={classes.address}>
                    <Typography variant="body2" color="textSecondary" fontSize={14}>
                        {formatEthereumAddress(address, 4)}
                    </Typography>
                    <Link
                        className={classes.link}
                        href={Utils?.resolveAddressLink?.(1, address) ?? ''}
                        target="_blank"
                        title="View on Explorer"
                        rel="noopener noreferrer">
                        <LinkIcon className={classes.linkIcon} />
                    </Link>
                    {lock ? <LockWalletIcon className={classes.linkIcon} /> : null}
                    {pending ? (
                        <Box className={classes.pending}>
                            <Typography variant="body1" color="#FFB100">
                                Pending
                            </Typography>
                            <CircularProgress size={14} color="error" sx={{ color: '#FFB100' }} />
                        </Box>
                    ) : null}
                </Box>
            </Box>
        </Box>
    )
}
