import { Box, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import type { BoxInfo, BoxMetadata } from '../../type.js'

const useStyles = makeStyles()((theme) => ({
    main: {
        height: 360,
        overflow: 'auto',
        padding: theme.spacing(2),
    },
    section: {
        margin: theme.spacing(4, 0),
        '&:first-child': {
            marginTop: 0,
        },
        '&:last-child': {
            marginBottom: 0,
        },
    },
    placeholder: {
        textAlign: 'center',
        marginTop: 170,
    },
    title: {
        fontSize: 18,
        fontWeight: 500,
        lineHeight: '24px',
        marginBottom: theme.spacing(4),
        color: theme.palette.maskColor.dark,
    },
    content: {
        lineHeight: '24px',
        whiteSpace: 'pre-line',
        color: theme.palette.maskColor.dark,
    },
}))

export interface DetailsTabProps {
    boxInfo: BoxInfo
    boxMetadata?: BoxMetadata
}

export function DetailsTab(props: DetailsTabProps) {
    const { boxInfo, boxMetadata } = props
    const { classes, theme } = useStyles()

    const definitions = boxMetadata?.activities.map((x) => ({
        title: x.title,
        content: x.body,
    }))

    if (!definitions)
        return (
            <Box className={classes.main}>
                <Typography className={classes.placeholder} color={theme.palette.maskColor.publicMain}>
                    No detailed information.
                </Typography>
            </Box>
        )

    return (
        <Box className={classes.main}>
            {definitions?.map((x, i) => (
                <section className={classes.section} key={i}>
                    <Typography className={classes.title} color={theme.palette.maskColor.publicMain} variant="h3">
                        {x.title}
                    </Typography>
                    <Typography className={classes.content} color={theme.palette.maskColor.publicMain} variant="body2">
                        {x.content}
                    </Typography>
                </section>
            ))}
        </Box>
    )
}
