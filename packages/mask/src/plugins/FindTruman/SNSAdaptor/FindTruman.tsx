import { useContext, useState } from 'react'
import { makeStyles } from '@masknet/theme'
import { FindTrumanContext } from '../context.js'
import { Avatar, Box, Card, CardHeader, CardMedia, Chip, Skeleton, Tooltip, Typography } from '@mui/material'
import type {
    CompletionQuestionAnswer,
    PollResult,
    PuzzleResult,
    StoryInfo,
    UserCompletionStatus,
    UserPollStatus,
    UserStoryStatus,
} from '../types.js'
import { FindTrumanI18nFunction, PostType } from '../types.js'
import ResultCard from './ResultCard.js'
import OptionsCard from './OptionsCard.js'
import Footer from './Footer.js'
import StageCard from './StageCard.js'
import EncryptionCard from './EncryptionCard.js'
import CompletionCard from './CompletionCard.js'
import { Icons } from '@masknet/icons'
import { WalletConnectedBoundary, ChainBoundary } from '@masknet/shared'
import { useChainContext } from '@masknet/web3-hooks-base'
import { NetworkPluginID } from '@masknet/shared-base'

const useStyles = makeStyles()((theme) => {
    return {
        root: {
            '--contentHeight': '400px',
            '--tabHeight': '35px',

            width: '100%',
            padding: 0,
            position: 'relative',
        },
        title: {
            fontSize: '1.25rem',
        },
        critical: {
            color: 'rgba(255,255,255,.9)',
            fontWeight: 500,
            fontSize: 14,
            width: 24,
            height: 24,
            backgroundImage: 'linear-gradient( 135deg, #FDD819 10%, #E80505 100%)',
            cursor: 'pointer',
        },
        nonCritical: {
            color: 'rgba(255,255,255,.9)',
            fontWeight: 500,
            fontSize: 14,
            width: 24,
            height: 24,
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
            cursor: 'pointer',
        },
        chip: {
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
            },
        },
        button: {
            backgroundColor: theme.palette.maskColor.dark,
            color: 'white',
            fontSize: 14,
            fontWeight: 700,
            width: '100%',
            '&:hover': {
                backgroundColor: theme.palette.maskColor.dark,
            },
            margin: '0 !important',
        },
    }
})

interface FindTrumanProps {
    postType: PostType
    clueId: string
    storyInfo?: StoryInfo
    userStoryStatus?: UserStoryStatus
    userPuzzleStatus?: UserPollStatus
    userPollStatus?: UserPollStatus
    userCompletionStatus?: UserCompletionStatus
    puzzleResult?: PuzzleResult
    pollResult?: PollResult
    onSubmitPoll(choice: number): Promise<void>
    onSubmitCompletion(answers: CompletionQuestionAnswer[]): Promise<void>
}

export function getPostTypeTitle(t: FindTrumanI18nFunction, postType: PostType) {
    switch (postType) {
        case PostType.Poll:
            return t('plugin_find_truman_status_poll')
        case PostType.Puzzle:
            return t('plugin_find_truman_status_puzzle')
        case PostType.Completion:
            return t('plugin_find_truman_status_completion')
        case PostType.PuzzleResult:
            return t('plugin_find_truman_status_puzzle_result')
        case PostType.PollResult:
            return t('plugin_find_truman_status_poll_result')
        case PostType.Status:
            return t('plugin_find_truman_status_result')
        default:
            return ''
    }
}

export function FindTruman(props: FindTrumanProps) {
    const { classes } = useStyles()
    const { address, t } = useContext(FindTrumanContext)
    const { chainId } = useChainContext<NetworkPluginID.PLUGIN_EVM>()
    const {
        postType,
        clueId,
        storyInfo,
        userStoryStatus,
        userPuzzleStatus,
        userPollStatus,
        userCompletionStatus,
        puzzleResult,
        pollResult,
        onSubmitPoll,
        onSubmitCompletion,
    } = props

    const [loadImg, setLoadImg] = useState(true)

    const isCritical = userPuzzleStatus?.critical || userPollStatus?.critical || userCompletionStatus?.critical
    const isNoncritical =
        (userPuzzleStatus && !userPuzzleStatus.critical) ||
        (userPollStatus && !userPollStatus.critical) ||
        (userCompletionStatus && !userCompletionStatus.critical)

    const renderCard = () => {
        if (postType === PostType.Status) {
            return <StageCard userStoryStatus={userStoryStatus} />
        } else if (postType === PostType.Puzzle && userPuzzleStatus) {
            return <OptionsCard onSubmit={onSubmitPoll} userStatus={userPuzzleStatus} />
        } else if (postType === PostType.Poll && userPollStatus) {
            return <OptionsCard onSubmit={onSubmitPoll} userStatus={userPollStatus} />
        } else if (postType === PostType.Completion) {
            return (
                <CompletionCard
                    onSubmit={(_, answers) => onSubmitCompletion(answers)}
                    completionStatus={userCompletionStatus}
                />
            )
        } else if (postType === PostType.PuzzleResult && puzzleResult) {
            return <ResultCard type={PostType.PuzzleResult} userStatus={userPuzzleStatus} result={puzzleResult} />
        } else if (postType === PostType.PollResult && pollResult) {
            return <ResultCard type={PostType.PollResult} userStatus={userPollStatus} result={pollResult} />
        }
        return null
    }

    return (
        <>
            <Card className={classes.root} elevation={0}>
                {postType !== PostType.Encryption ? (
                    <>
                        <CardMedia
                            onLoad={() => {
                                setLoadImg(false)
                            }}
                            alt=""
                            component="img"
                            height={140}
                            sx={{
                                visibility: loadImg ? 'hidden' : 'unset',
                            }}
                            image={storyInfo?.img}
                        />
                        {loadImg && (
                            <Box sx={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%' }}>
                                <Skeleton animation="wave" variant="rectangular" height={140} width="100%" />
                            </Box>
                        )}
                        <CardHeader
                            title={
                                storyInfo && (
                                    <Box
                                        display="flex"
                                        flexWrap="wrap"
                                        alignItems="center"
                                        justifyContent="space-between">
                                        <Typography className={classes.title} component="b" sx={{ marginRight: 0.5 }}>
                                            {storyInfo.name}
                                        </Typography>
                                        <Box display="flex" columnGap={1}>
                                            <Tooltip
                                                PopperProps={{
                                                    disablePortal: true,
                                                }}
                                                arrow
                                                placement="top"
                                                title={
                                                    isCritical
                                                        ? t('plugin_find_truman_status_critical')
                                                        : isNoncritical
                                                        ? t('plugin_find_truman_status_noncritical')
                                                        : ''
                                                }>
                                                <Box>
                                                    {isCritical && <Avatar className={classes.critical}>C</Avatar>}
                                                    {isNoncritical && (
                                                        <Avatar className={classes.nonCritical}>N</Avatar>
                                                    )}
                                                </Box>
                                            </Tooltip>
                                            <Chip
                                                className={classes.chip}
                                                color="primary"
                                                size="small"
                                                label={getPostTypeTitle(t, postType)}
                                            />
                                        </Box>
                                    </Box>
                                )
                            }
                        />
                        {renderCard()}
                    </>
                ) : (
                    <EncryptionCard clueId={clueId} />
                )}

                <Footer />
            </Card>

            <Box style={{ padding: 12 }}>
                <ChainBoundary
                    expectedPluginID={NetworkPluginID.PLUGIN_EVM}
                    expectedChainId={chainId}
                    ActionButtonPromiseProps={{ variant: 'roundedDark' }}>
                    <WalletConnectedBoundary
                        classes={{ button: classes.button }}
                        startIcon={<Icons.ConnectWallet size={18} />}
                        ActionButtonProps={{ variant: 'roundedDark' }}
                    />
                </ChainBoundary>
            </Box>
        </>
    )
}
