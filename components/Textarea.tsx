import * as React from 'react'
import styled from 'styled-components'

type Props = {
  textAreaProps: object
  id: string
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement>
  handleKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  hideLookup: () => void;
}

const Textarea = ({ textAreaProps, id, textAreaRef, handleKeyUp, hideLookup }: Props) => (
  <TextareaField
    {...textAreaProps}
    id={id}
    wrap='off'
    ref={textAreaRef}
    onKeyUp={handleKeyUp}
    onClick={hideLookup}
    rows={10}
    cols={80}
    data-testid="mention-textarea"
  ></TextareaField>
)

const TextareaField = styled.textarea`
  font-family: sans-serif;
	padding: 12px;
	max-width: 50%;
`;

export default Textarea
