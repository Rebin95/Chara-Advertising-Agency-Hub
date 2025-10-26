import React from 'react';

// Helper for standard 24px icons
const Icon24: React.FC<{ children: string }> = ({ children }) => (
    <span className="material-symbols-outlined" style={{ fontSize: '24px', verticalAlign: 'middle', lineHeight: 1 }}>
        {children}
    </span>
);

// Helper for 20px icons (used for SheetsIcon)
const Icon20: React.FC<{ children: string }> = ({ children }) => (
    <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', lineHeight: 1 }}>
        {children}
    </span>
);

export const ManagerIcon = () => <Icon24>leaderboard</Icon24>;
export const CaptionIcon = () => <Icon24>subtitles</Icon24>;
export const DesignIcon = () => <Icon24>palette</Icon24>;
export const DocsIcon = () => <Icon24>article</Icon24>;
export const ScriptIcon = () => <Icon24>movie</Icon24>;
export const NewsIcon = () => <Icon24>bolt</Icon24>;
export const MedicalIcon = () => <Icon24>medical_services</Icon24>;
export const ZanaIcon = () => <Icon24>psychology</Icon24>;
export const IdeaIcon = () => <Icon24>lightbulb</Icon24>;
export const SpeakerIcon = () => <Icon24>volume_up</Icon24>;
export const PaperclipIcon = () => <Icon24>attachment</Icon24>;
export const TagIcon = () => <Icon24>tag</Icon24>;
export const CopyIcon = () => <Icon24>content_copy</Icon24>;
export const CheckIcon = () => <Icon24>check</Icon24>;
export const SheetsIcon = () => <Icon20>table_view</Icon20>;
export const SettingsIcon = () => <Icon24>settings</Icon24>;
export const AnalyzeIcon = () => <Icon24>analytics</Icon24>;
export const TranslateIcon = () => <Icon24>translate</Icon24>;
export const GrammarIcon = () => <Icon24>spellcheck</Icon24>;
export const SummarizeIcon = () => <Icon24>compress</Icon24>;
export const RobotIcon = () => <Icon24>smart_toy</Icon24>;
export const CloseIcon = () => <Icon24>close</Icon24>;
export const TaskIcon = () => <Icon24>task_alt</Icon24>;
export const ProfileIcon = () => <Icon24>account_circle</Icon24>;
export const InstallIcon = () => <Icon24>install_desktop</Icon24>;
export const PdfIcon = () => <Icon24>picture_as_pdf</Icon24>;
export const PostIcon = () => <Icon24>article</Icon24>;
export const VideoIcon = () => <Icon24>videocam</Icon24>;
export const SponsorshipIcon = () => <Icon24>paid</Icon24>;
export const VisitingIcon = () => <Icon24>groups</Icon24>;
export const StoriesIcon = () => <Icon24>auto_stories</Icon24>;
export const ListIcon = () => <Icon24>view_list</Icon24>;
export const ChartIcon = () => <Icon24>bar_chart</Icon24>;
export const SunIcon = () => <Icon24>light_mode</Icon24>;
export const MoonIcon = () => <Icon24>dark_mode</Icon24>;
export const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.474.854-1.217 4.433 4.515-1.182zM15.072 12.87c-.07-.12-.262-.208-.438-.347-.176-.14-.42-.28-.687-.463-.267-.184-.463-.275-.632-.314-.17-.04-.332-.04-.488.04-.155.08-.246.238-.337.377-.09.14-.14.28-.14.43s0 .225.04.305c.04.08.08.14.12.18.04.04.08.08.12.12.104.096.19.2.29.313.1.112.14.184.184.238.04.054.08.12.08.183s-.01.12-.04.184c-.03.062-.163.266-.377.462-.214.197-.43.337-.645.42-.214.082-.41.12-.592.12-.182 0-.396-.04-.592-.12-.196-.08-.377-.208-.532-.377-.155-.17-.28-.396-.36-.678-.08-.28-.12-.593-.12-.92 0-.326.04-.63.12-.904.08-.275.2-.514.36-.71s.347-.348.562-.448c.214-.1.43-.16.645-.183.215-.02.43-.02.63.02.183.04.347.097.488.183.14.088.246.215.313.377.068.16.08.305.08.43s-.03.263-.08.377c-.05.113-.104.208-.183.28-.08.07-.12.12-.12.12s.104.12.224.237c.12.118.225.225.313.314.09.9.163.163.224.225.06.06.12.12.184.183.062.062.104.097.12.12.02.02.04.02.04.02s.062-.01.12-.04c.06-.03.12-.06.184-.12s.14-.12.183-.183c.04-.062.08-.12.12-.208.04-.08.04-.14.04-.2s0-.163-.04-.262c-.04-.1-.097-.2-.184-.28-.088-.083-.176-.176-.263-.28s-.13-.208-.13-.262.01-.12.062-.184c.05-.062.113-.12.183-.183.07-.06.14-.12.224-.163.08-.04.16-.08.237-.12.078-.04.14-.04.14-.04s.104.01.21.14c.103.13.19.28.262.448.113.237.17.498.17.78s-.062.562-.183.805c-.12.244-.295.448-.52.618-.227.17-.498.262-.812.262-.314 0-.61-.09-.88-.263-.27-.174-.508-.408-.705-.705-.197-.297-.337-.61-.42-.94s-.12-.658-.12-1v-.01c0-.35.04-.68.12-1 .08-.32.2-.61.36-.87s.347-.488.562-.687c.215-.2.455-.347.71-.448.255-.1.522-.14.805-.14s.55.04.805.14c.254.1.498.247.71.448.21.2.385.42.522.687.137.268.208.562.208.88z"/>
    </svg>
);
export const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/>
    </svg>
);
export const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
    </svg>
);
export const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.83-.65-6.43-2.61-1.26-1.53-1.85-3.45-1.8-5.45.02-1.7.56-3.4 1.48-4.82.98-1.52 2.55-2.64 4.33-3.15.02-1.74-.01-3.48-.01-5.22.08-1.52.63-3.09 1.75-4.17 1.12-1.11 2.7-1.62 4.24-1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.83-.65-6.43-2.61-1.26-1.53-1.85-3.45-1.8-5.45.02-1.7.56-3.4 1.48-4.82.98-1.52 2.55-2.64 4.33-3.15.02-1.74-.01-3.48-.01-5.22h4.02z"/>
    </svg>
);