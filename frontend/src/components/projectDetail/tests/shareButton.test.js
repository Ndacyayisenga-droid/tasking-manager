import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IntlProviders } from '../../../utils/testWithIntl';
import { ShareButton } from '../shareButton';

describe('test if shareButton', () => {
  it('render shareButton for project with id 1', () => {
    const { container } = render(
      <IntlProviders>
        <ShareButton projectId={1} />
      </IntlProviders>,
    );
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Tweet')).toBeInTheDocument();
    expect(screen.getByText('Post on Facebook')).toBeInTheDocument();
    expect(screen.getByText('Share on LinkedIn')).toBeInTheDocument();

    const svg = container.querySelectorAll('svg');
    expect(svg.length).toBe(4);

    const socialIconLabels = [];
    svg.forEach((icon) => {
      if (icon.attributes.getNamedItem('aria-label')) {
        socialIconLabels.push(icon.attributes.getNamedItem('aria-label').value);
      }
    });
    expect(socialIconLabels).toMatchObject(['Twitter', 'Facebook', 'LinkedIn']);
  });

  it('render open corresponding window popup', async () => {
    global.open = jest.fn();
    render(
      <IntlProviders>
        <ShareButton projectId={1} />
      </IntlProviders>,
    );
    await userEvent.click(screen.getByText(/tweet/i));
    await userEvent.click(screen.getByText(/post on facebook/i));
    await userEvent.click(screen.getByText(/share on linkedin/i));

    expect(global.open).toHaveBeenCalledTimes(3);
  });
});
