import React, { FC } from 'react';

interface CardProps {
  hasHeader?: boolean;
  title?: string;
  hasPlus?: boolean;
  plusTarget?: string;
  content: React.ReactNode;
  onPlusClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Card: FC<CardProps> = ({ hasHeader = true, title, hasPlus, plusTarget, content, onPlusClick }) => {
  return (
    <div className="main-card card">
      <div className="card-body">
        {hasHeader &&
          <div className="d-flex">
            <div className="card-title">{title}</div>
            {hasPlus &&
              <div className="ml-3 d-flex plus-action">
                <a
                  href="/"
                  data-toggle="modal"
                  data-target={plusTarget}
                  onClick={onPlusClick}
                >
                  <i className="fa fa-fw fa-lg"></i>
                </a>
              </div>
            }
          </div>
        }

        {content}
      </div>
    </div>
  );
};

export default Card;
