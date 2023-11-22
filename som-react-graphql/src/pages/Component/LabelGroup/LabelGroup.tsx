import React, { FC } from 'react';

import styles from './LabelGroup.module.css';

interface LabelGroupProps {
  leftLabel: string;
  rightLabel: string;
  hasLink?: boolean;
  isOrange?: boolean;
  fontSize?: number;
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  linkTo?: string;
}

const LabelGroup: FC<LabelGroupProps> = ({ leftLabel = "-", rightLabel = "-", hasLink = false, isOrange = false, fontSize = 16, onLinkClick, linkTo }) => {
  return (
    <div className="d-flex">
      <div
        className={`label ${styles["left-label"]} w-50 ${isOrange ? styles["left-label-orange"] : styles["left-label-blue"]}`}
        style={{ fontSize: fontSize }}
      >
        {hasLink ?
          <a href="/" onClick={onLinkClick}>{leftLabel}</a>
          :
          <>{leftLabel}</>
        }
      </div>
      <div className={`label ${styles["right-label"]} w-50`} style={{ fontSize: fontSize }}>
        {rightLabel}
      </div>
    </div>
  );
};

export default LabelGroup;