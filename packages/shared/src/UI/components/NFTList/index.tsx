import { FC, useCallback } from 'react'
import { noop } from 'lodash-es'
import type { Web3Helper } from '@masknet/web3-helpers'
import { ElementAnchor, Linking, AssetPreviewer, RetryHint } from '@masknet/shared'
import { LoadingBase, makeStyles } from '@masknet/theme'
import { NetworkPluginID } from '@masknet/shared-base'
import { isSameAddress, NonFungibleToken } from '@masknet/web3-shared-base'
import { useChainContext, useWeb3State, useNetworkContext } from '@masknet/web3-hooks-base'
import type { ChainId, SchemaType } from '@masknet/web3-shared-evm'
import { Checkbox, List, ListItem, Radio, Stack, Typography } from '@mui/material'

interface NFTItemProps {
    token: NonFungibleToken<ChainId, SchemaType>
}

export type NFTKeyPair = [address: string, tokenId: string]

interface Props {
    selectable?: boolean
    tokens: Array<Web3Helper.NonFungibleAssetScope<void, NetworkPluginID.PLUGIN_EVM>>
    selectedPairs?: NFTKeyPair[]
    onChange?: (id: string | null, contractAddress?: string) => void
    limit?: number
    columns?: number
    gap?: number
    className?: string
    onNextPage(): void
    finished: boolean
    hasError?: boolean
}

const useStyles = makeStyles<{ columns?: number; gap?: number }>()((theme, { columns = 4, gap = 12 }) => {
    const isLight = theme.palette.mode === 'light'
    return {
        checkbox: {
            position: 'absolute',
            right: 0,
            top: 0,
        },
        list: {
            gridGap: gap,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
        },
        nftContainer: {
            background: isLight ? '#EDEFEF' : '#2F3336',
            borderRadius: 8,
            width: 126,
            height: 154,
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            '&:hover': {
                backgroundColor: isLight ? theme.palette.background.paper : undefined,
                boxShadow: isLight ? '0px 4px 30px rgba(0, 0, 0, 0.1)' : undefined,
            },
        },
        nftItem: {
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            padding: 0,
            flexDirection: 'column',
            userSelect: 'none',
        },
        link: {
            width: '100%',
            '&:hover': {
                textDecoration: 'none',
            },
        },
        disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
        selected: {
            position: 'relative',
            '&::after': {
                position: 'absolute',
                border: `2px solid ${theme.palette.primary.main}`,
                content: '""',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
                borderRadius: 12,
            },
        },
        inactive: {
            opacity: 0.5,
        },
        image: {
            width: 126,
            height: 126,
        },
        caption: {
            padding: theme.spacing(0.5),
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 12,
        },
        root: {
            width: 'auto',
            height: 'auto',
        },
    }
})

export const NFTItem: FC<NFTItemProps> = ({ token }) => {
    const { classes, cx } = useStyles({})
    const { chainId } = useChainContext<NetworkPluginID.PLUGIN_EVM>()
    const { Others } = useWeb3State(NetworkPluginID.PLUGIN_EVM)
    const fullCaption = token.metadata?.name || token.tokenId
    const caption = token.metadata?.name?.match(/#\d+$/) ? token.metadata.name : Others?.formatTokenId(token.tokenId)
    return (
        <div className={classes.nftContainer}>
            <AssetPreviewer
                url={token.metadata?.imageURL ?? token.metadata?.imageURL}
                classes={{
                    fallbackImage: classes.image,
                    container: classes.image,
                    root: classes.root,
                }}
            />
            <Typography className={classes.caption} title={fullCaption !== caption ? fullCaption : undefined}>
                {caption}
            </Typography>
        </div>
    )
}

export const NFTList: FC<Props> = ({
    selectable,
    selectedPairs,
    tokens,
    onChange,
    limit = 1,
    columns = 4,
    gap = 12,
    className,
    onNextPage,
    finished,
    hasError,
}) => {
    const { classes, cx } = useStyles({ columns, gap })

    const isRadio = limit === 1
    const reachedLimit = selectedPairs && selectedPairs.length >= limit

    const { pluginID } = useNetworkContext()
    const { Others } = useWeb3State(NetworkPluginID.PLUGIN_EVM)

    const toggleItem = useCallback(
        (currentId: string | null, contractAddress?: string) => {
            onChange?.(currentId, contractAddress)
        },
        [onChange],
    )
    const includes: (pairs: NFTKeyPair[], pair: NFTKeyPair) => boolean =
        pluginID === NetworkPluginID.PLUGIN_EVM
            ? (pairs, pair) => {
                  return !!pairs.find(([address, tokenId]) => isSameAddress(address, pair[0]) && tokenId === pair[1])
              }
            : (pairs, pair) => {
                  return !!pairs.find(([, tokenId]) => tokenId === pair[1])
              }

    const SelectComponent = isRadio ? Radio : Checkbox

    return (
        <>
            <List className={cx(classes.list, className)}>
                {tokens.map((token) => {
                    const selected = selectedPairs
                        ? includes(selectedPairs, [token.contract?.address!, token.tokenId])
                        : false
                    const inactive = selectedPairs ? selectedPairs.length > 0 && !selected : false
                    const disabled = selectable ? !isRadio && reachedLimit && !selected : false
                    const link = token.contract
                        ? Others?.explorerResolver?.nonFungibleTokenLink(
                              token.contract.chainId,
                              token.contract.address,
                              token.tokenId,
                          )
                        : undefined
                    return (
                        <ListItem
                            key={token.tokenId + token.id}
                            className={cx(classes.nftItem, {
                                [classes.disabled]: disabled,
                                [classes.selected]: selected,
                                [classes.inactive]: inactive,
                            })}>
                            <Linking LinkProps={{ className: classes.link }} href={link}>
                                <NFTItem token={token} />
                            </Linking>
                            {selectable ? (
                                <SelectComponent
                                    size="small"
                                    onChange={noop}
                                    disabled={disabled}
                                    onClick={() => {
                                        if (disabled) return
                                        if (selected) {
                                            toggleItem(null, '')
                                        } else {
                                            toggleItem(token.tokenId, token.contract?.address)
                                        }
                                    }}
                                    className={classes.checkbox}
                                    checked={selected}
                                />
                            ) : null}
                        </ListItem>
                    )
                })}
            </List>
            {hasError && !finished && tokens.length ? (
                <Stack py={1}>
                    <RetryHint hint={false} retry={onNextPage} />
                </Stack>
            ) : null}
            <Stack py={1}>
                <ElementAnchor callback={onNextPage}>{!finished && <LoadingBase />}</ElementAnchor>
            </Stack>
        </>
    )
}
