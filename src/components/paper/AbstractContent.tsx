import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { normalizeAbstractLatex } from '@/utils/abstractLatex';

interface AbstractContentProps {
  children: string;
  preview?: boolean;
}

const AbstractContent: React.FC<AbstractContentProps> = ({
  children,
  preview = false,
}) => (
  <Box
    className="paper-abstract-content"
    sx={{
      mt: 0.15,
      color: 'text.secondary',
      typography: 'body2',
      fontSize: '0.82rem',
      '& p': { m: 0 },
      '& p + p': { mt: 1 },
      '& code': {
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.92em',
      },
      '& .katex': { fontSize: '1.02em' },
      '& .katex-display': {
        my: 0.75,
        overflowX: 'auto',
        overflowY: 'hidden',
      },
      ...(preview && {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 1,
        overflow: 'hidden',
        lineHeight: 1.45,
        '& p': { m: 0, display: 'inline' },
        '& p + p': { mt: 0 },
        '& .katex-display': {
          display: 'inline',
          my: 0,
          overflow: 'visible',
        },
      }),
    }}
  >
    <ReactMarkdown
      remarkPlugins={[[remarkMath, { singleDollarTextMath: true }]]}
      rehypePlugins={[
        [
          rehypeKatex,
          {
            strict: false,
            throwOnError: false,
            macros: {
              '\\E': '\\mathbb{E}',
              '\\KL': '\\operatorname{KL}',
              '\\Pcal': '\\mathcal{P}',
              '\\Prob': '\\mathbb{P}',
              '\\Qcal': '\\mathcal{Q}',
              '\\Reg': '\\operatorname{Reg}',
              '\\X': '\\mathcal{X}',
              '\\meanspace': '\\mathcal{M}',
            },
          },
        ],
      ]}
    >
      {normalizeAbstractLatex(children)}
    </ReactMarkdown>
  </Box>
);

export default AbstractContent;
