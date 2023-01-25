import type { Meta, StoryObj } from '@storybook/react';
import { Heading, HeadingProps } from '@ignite-ui/react';

export default {
  title: 'Typography/Heading',
  component: Heading,
  args: {
    children: 'Custom title',
  },
} as Meta<HeadingProps>;

export const Primary: StoryObj<HeadingProps> = {
  args: {},
};

export const CustomTag: StoryObj<HeadingProps> = {
  args: {
    children: 'H1 Heading',
    as: 'h1',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default element rendered by Heading component is h2, but we can change to others like `h1` using the props `as`',
      },
    },
  },
};
