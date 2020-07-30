import * as React from 'react'
import styled from 'styled-components'

import { User } from '../interfaces'

type Props = {
  lookupId: string
  cssClass?: string
  lookupStyles: object
  mentionList: User[]
  symbol: string
  insertNameIntoInput: (_e: React.MouseEvent<HTMLLIElement, MouseEvent>, dataField: string) => void
  renderContent?: (mentions: any) => React.ReactNode
}

const MentionList = ({ lookupId, cssClass, lookupStyles, mentionList, symbol, insertNameIntoInput, renderContent}: Props) => (
  <div
    id={lookupId}
    className={`mention-lookup${cssClass ? ' ' + cssClass : ''}`}
    style={lookupStyles}
  >
    <List id="list" data-testid="users-ul">
      {mentionList.map((mention, i) => {
        return (
          <Item
            key={i}
            className="mention-li"
            onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => insertNameIntoInput(e, mention.name)}
          >
            {renderContent ? (
              renderContent(mention)
            ) : (
              <InnerText>
                <Avatar src={mention.avatar_url} alt={mention.username} />
                {mention.name} - {symbol}{mention.username}
              </InnerText>
            )}
          </Item>
        );
      })}
    </List>
  </div>
)

const List = styled.ul`
  color: #ccc;
	margin: 0;
	padding: 0;
	list-style-type: none;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .2), 0 6px 20px 0 rgba(0, 0, 0, .19);
	background-color: white;
`;

const Item = styled.li`
  padding: 8px 16px;
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
  &:hover {
    background: #eee;
	  cursor: pointer
  }
`;

const InnerText = styled.div`
  font: 12px/1.5 Helvetica, Verdana, sans-serif;
	color: #555;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  vertical-align: bottom;
  margin-right: 6px;
`;

export default MentionList
