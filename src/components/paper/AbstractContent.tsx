import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { normalizeAbstractLatex } from '@/utils/abstractLatex';

interface AbstractContentProps {
  children: string;
}

const AbstractContent: React.FC<AbstractContentProps> = ({ children }) => (
  <Box
    className="paper-abstract-content"
    sx={{
      mt: 0.15,
      color: 'text.secondary',
      typography: 'body2',
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
