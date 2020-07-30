import React, { FunctionComponent, useState, useRef, useEffect, ReactNode } from "react";
import styled, { createGlobalStyle } from 'styled-components'

import MentionList from './MentionList'
import Textarea from './Textarea'

import { User } from '../interfaces'
import GetCoords from '../utils/getcoords';
import extractMention from '../utils/extract-mention';
import generateId from '../utils/generate-id'


type Props = {
  symbol?: string
  cssClass?: string
  users: Array<User>
  onChange?: (value: string) => void;
  limit?: number
  requestFunc?: (mentions: any) => Promise<any>
  renderContent?: (mentions: any) => ReactNode
  onMentionChange?: (mentions: string) => void;
  textAreaProps?: object
  iterableCoordsProps?: boolean
}

const Mention:FunctionComponent<Props> = ({
  symbol = "@",
  cssClass,
  users = [],
  onChange,
  limit = 6,
  requestFunc,
  renderContent,
  onMentionChange,
  textAreaProps = {},
  iterableCoordsProps = false
}) => {
  const textAreaRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const [id] = useState("mention-textarea-" + generateId());
  const [lookupId] = useState("lookup-menu-" + generateId());

  const [startAt, setStartAt] = useState(-1);
  const [mentionSize, setMentionSize] = useState(0);
  const intialList: User[] = [];
  const [mentionList, setMentionList] = useState(intialList);
  const [lookupStyles, setLookupStyles] = useState({});

  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true)
  });

  const setupLookup = () => {
    let { x, y } = GetCoords(textAreaRef.current, iterableCoordsProps);
    setLookupStyles({ position: "absolute", left: `${x}px`, top: `${y}px` });
  };

  const hideLookup = () => setMentionList([]);

  const insertNameIntoInput = (_e: React.MouseEvent<HTMLLIElement, MouseEvent>, dataField: string) => {
    const textArea: any = textAreaRef.current;
    const first = textArea.value.substr(0, startAt);
    const last = textArea.value.substr(
      startAt + mentionSize,
      textArea.value.length
    );
    const content = `${first.slice(0, -1)}${dataField}${last}`;
    textArea.value = content;
    setMentionSize(dataField.length);
    textArea.focus();
    if (onChange) onChange(textArea.value);
    hideLookup();
  };

  const updateMentionList = () => {
    const textArea: { value: any } = textAreaRef.current;
    const mention = extractMention(textArea.value, startAt);

    if (requestFunc) {
      requestFunc(mention).then(results => {
        if (results)
          setMentionList(results);
      }).catch(err => console.error(err));
    } else {
      const filteredData: User[] = users
        .filter((d) => d.name.toLowerCase().includes(mention))
        .slice(0, limit);
        setMentionList(filteredData);
    }

    if (onMentionChange) onMentionChange(mention);
    if (onChange) onChange(textArea.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart: start } = e.target as HTMLTextAreaElement;
    const character = value.substring(start - 1, start);
    if (onChange) onChange(value);

    if (character === symbol) {
      setStartAt(start);
      setupLookup();
      return;
    }
    if (character === " " || value.trim() === "") {
      setStartAt(-1);
      hideLookup();
      return;
    }
    if (startAt > -1) {
      updateMentionList();
      setMentionSize(mentionSize + 1);
      return;
    }
  };

  return rendered ? (
    <Container>
      <MentionList
        lookupId={lookupId}
        cssClass={cssClass}
        lookupStyles={lookupStyles}
        mentionList={mentionList}
        symbol={symbol}
        insertNameIntoInput={insertNameIntoInput}
        renderContent={renderContent}
      />

      <Textarea
        textAreaProps={textAreaProps}
        id={id}
        textAreaRef={textAreaRef}
        handleKeyUp={handleKeyUp}
        hideLookup={hideLookup}
      />

    <Hint>
      Mention a user by typing "@" and the username then click on a user from the list.
    </Hint>
    <GlobalStyle />
    </Container>
  )
  : <Container><p>Loading...</p></Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #34495E;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }
`;

const Hint = styled.p`
  font-size: .8rem;
  margin-top: 24px;
  color: #fff;
  opacity: .5;
`;

export default Mention;