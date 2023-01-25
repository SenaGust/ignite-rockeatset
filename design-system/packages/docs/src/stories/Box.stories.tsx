import type { Meta, StoryObj } from '@storybook/react';
import { Box, BoxProps, Text } from '@ignite-ui/react';

export default {
  title: 'Form/Box',
  component: Box,
  args: {
    children: <Text>Testing box element</Text>,
  },
} as Meta<BoxProps>;

export const box: StoryObj<BoxProps> = {
  args: {},
};
