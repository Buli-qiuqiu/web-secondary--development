import React from 'react';
import { Spin, Skeleton } from 'antd';

const SkeletonParagraphProps = {
  rows: 4,
  width: ['100%', '100%', '100%', '100%'],
};

const LoadingSkeleton = props => (
  <Skeleton title={false} active paragraph={SkeletonParagraphProps} />
);

const Loading = ({ type = 'spin' }) => {
  if (type === 'skeleton')
    return <LoadingSkeleton style={{ width: '100%', margin: '10px auto' }} />;
  else
    return (
      <div>
        <Spin
          delay={200}
          style={{ width: '100%', margin: '10px auto' }}
          spinning={true}
        />
      </div>
    );
};

export default Loading;