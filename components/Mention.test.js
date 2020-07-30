import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Mention from './Mention'
import { sampleUserData as users } from '../utils/sample-data'

describe("Mention", () => {
    const setup = () => {
      const utils = render(<Mention users={users} iterableCoordsProps={true} />)
      const input = utils.getByTestId('mention-textarea')
      return {
        input,
        ...utils,
      }
    }

    it('It should change the value of textarea', () => {
      const { input } = setup();
      userEvent.type(input, '@j');

      expect(input.value).toBe('@j');
    })

    it('It should display a list of 6 users that includes (j)', () => {
      const { input } = setup();
      userEvent.type(input, '@j');
      expect(screen.getByTestId("users-ul").childElementCount).toBe(6);
    })

    it('It should select the first user in the list ', () => {
      const data = [
        {
          "username": "jmurray9",
          "avatar_url": "https://secure.gravatar.com/avatar/cd4318b7fb1cf64648f59198aca8757f?d=mm",
          "name": "Justin Murray"
        }
      ]
      const input = render(<Mention users={data} iterableCoordsProps={true} />).getByTestId('mention-textarea');

      userEvent.type(input, '@justin');
      userEvent.click(screen.getByTestId("users-ul").firstElementChild);

      expect(input.value).toBe('Justin Murray');
    })

    it('It should display two users in the list ', () => {
      const data = [
        {
          "username": "adamolper",
          "avatar_url": "https://secure.gravatar.com/avatar/cd4318b7fb1cf64648f59198aca8757f?d=mm",
          "name": "Adam Copler"
        },
        {
          "username": "damdavid",
          "avatar_url": "https://secure.gravatar.com/avatar/cd4318b7fb1cf64648f59198aca8757f?d=mm",
          "name": "Adam David"
        }
      ]
      const input = render(<Mention users={data} iterableCoordsProps={true} />).getByTestId('mention-textarea');

      userEvent.type(input, '@adam');

      screen.debug(screen.getByTestId("users-ul"))
      const userCount = screen.getByTestId("users-ul").childElementCount

      expect(userCount).toBe(2);
    })
  });