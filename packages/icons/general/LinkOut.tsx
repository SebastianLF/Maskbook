import { createPaletteAwareIcon, createIcon } from '../utils'
import type { SvgIcon } from '@mui/material'

const LinkOutLightIconSvg = (
    <g>
        <path
            d="M12.6667 13.1667H13.1667V12.6667V8.5H13.5V12.6667C13.5 13.1239 13.1239 13.5 12.6667 13.5H3.33333C2.8711 13.5 2.5 13.1255 2.5 12.6667V3.33333C2.5 2.87451 2.8711 2.5 3.33333 2.5H7.5V2.83333H3.33333H2.83333V3.33333V12.6667V13.1667H3.33333H12.6667ZM13.1667 6.16667V4.27333V3.06623L12.3131 3.91978L6.11333 10.1196L5.88044 9.88667L12.0802 3.68689L12.9338 2.83333H11.7267H9.83333V2.5H13.5V6.16667H13.1667Z"
            fill="#F5F5F5"
            stroke="#F5F5F5"
        />
    </g>
)

const LinkOutDarkIconSvg = (
    <g>
        <path
            d="M12.6667 13.1667H13.1667V12.6667V8.5H13.5V12.6667C13.5 13.1239 13.1239 13.5 12.6667 13.5H3.33333C2.8711 13.5 2.5 13.1255 2.5 12.6667V3.33333C2.5 2.87451 2.8711 2.5 3.33333 2.5H7.5V2.83333H3.33333H2.83333V3.33333V12.6667V13.1667H3.33333H12.6667ZM13.1667 6.16667V4.27333V3.06623L12.3131 3.91978L6.11333 10.1196L5.88044 9.88667L12.0802 3.68689L12.9338 2.83333H11.7267H9.83333V2.5H13.5V6.16667H13.1667Z"
            fill="#07101B"
            stroke="#07101B"
        />
    </g>
)

export const LinkOutIcon: typeof SvgIcon = createPaletteAwareIcon(
    'LinkOutIcon',
    LinkOutDarkIconSvg,
    LinkOutLightIconSvg,
    undefined,
    '0 0 16 16',
)

export const LinkOutLightIcon = createIcon('LinkOutLightIcon', LinkOutLightIconSvg, '0 0 16 16')

export const LinkOutDarkIcon = createIcon('LinkOutDarkIcon', LinkOutDarkIconSvg, '0 0 16 16')
