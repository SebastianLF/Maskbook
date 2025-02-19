import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import type { GoodGhostingInfo } from '../types.js'
import formatDateTime from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import { useTimeline } from '../hooks/useGameInfo.js'

const useStyles = makeStyles()((theme) => ({
    text: {
        whiteSpace: 'nowrap',
    },
    timelineWrapper: {
        overflowX: 'auto',
    },
    timeline: {
        margin: theme.spacing(1),
        overflow: 'visible',
        flexWrap: 'nowrap',
        alignItems: 'flex-end',
    },
    timelinePadding: {
        height: '1px',
        paddingLeft: theme.spacing(10),
    },
    timelineCells: {
        position: 'relative',
        overflow: 'visible',
    },
    eventText: {
        position: 'relative',
        padding: theme.spacing(1.5, 2),
        margin: theme.spacing(1.5),
        marginTop: 0,
        borderTop: '1px solid #D9E0F0',
        whiteSpace: 'nowrap',
    },
    rightAligned: {
        position: 'absolute',
        right: `calc(-4px - ${theme.spacing(1.5)})`,
        top: '-4px',
    },
    timelineEvent: {
        position: 'relative',
        left: 0,
        transform: 'translateX(50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bottom: '-4px',
        width: '1px',
    },
    circleIndicator: {
        borderRadius: '100%',
        width: '8px',
        height: '8px',
        border: '2px solid #8E79FC',
        boxSizing: 'border-box',
    },
    circleIndicatorFilled: {
        background: '#8E79FC',
    },
    circleIndicatorEmpty: {
        background: 'none',
    },
    verticalLine: {
        width: '1px',
        background: '#D9E0F0',
        marginBottom: theme.spacing(1),
    },
    tallVerticalLine: {
        height: '120px',
    },
    shortVerticalLine: {
        height: '50px',
    },
}))

interface TimelineViewProps {
    info: GoodGhostingInfo
}

export function TimelineView(props: TimelineViewProps) {
    const { classes, cx } = useStyles()
    const timeline = useTimeline(props.info)

    return (
        <div className={classes.timelineWrapper}>
            <Grid container className={classes.timeline}>
                <Grid item className={classes.timelinePadding} />
                {timeline.map((timelineEvent, index) => (
                    <Grid item className={classes.timelineCells} key={index}>
                        <div className={classes.timelineEvent}>
                            <Typography variant="caption" color="textSecondary" className={classes.text}>
                                {timelineEvent.eventOnDate}
                            </Typography>
                            <Typography variant="subtitle2" color="textPrimary" className={classes.text}>
                                {formatDateTime(timelineEvent.date, 'HH:mm EEE d LLL O')}
                            </Typography>
                            <div
                                className={cx(
                                    classes.verticalLine,
                                    index % 2 === 0 ? classes.tallVerticalLine : classes.shortVerticalLine,
                                )}
                            />
                            <div
                                className={cx(
                                    classes.circleIndicator,
                                    isBefore(new Date(), timelineEvent.date)
                                        ? classes.circleIndicatorFilled
                                        : classes.circleIndicatorEmpty,
                                )}
                            />
                        </div>
                        <div className={classes.eventText}>
                            {index === timeline.length - 1 && (
                                <div
                                    className={cx(
                                        classes.circleIndicator,
                                        classes.circleIndicatorFilled,
                                        classes.rightAligned,
                                    )}
                                />
                            )}
                            <Typography variant="caption" color="textSecondary" className={classes.text}>
                                {timelineEvent.ongoingEvent}
                            </Typography>
                        </div>
                    </Grid>
                ))}
                <Grid item className={classes.timelinePadding} />
            </Grid>
        </div>
    )
}
