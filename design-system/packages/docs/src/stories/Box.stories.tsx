import type { Meta, StoryObj } from '@storybook/react';
import { Box, BoxProps } from '@ignite-ui/react';

export default {
  title: 'Form/Box',
  component: Box,
  args: {
    children: <>Testing box element</>,
  },
} as Meta<BoxProps>;

export const box: StoryObj<BoxProps> = {
  args: {},
};
