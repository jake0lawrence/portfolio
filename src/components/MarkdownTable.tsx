import React from 'react';

export interface MarkdownTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

export default function MarkdownTable({ children, ...props }: MarkdownTableProps) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '8px', marginBottom: '16px' }}>
      <table
        {...props}
        style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%', minWidth: '32rem' }}
      >
        {children}
      </table>
    </div>
  );
}
