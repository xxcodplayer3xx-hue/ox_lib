import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'left',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    border: '1px solid rgba(113, 237, 218, 0.3)',
    borderBottom: '1px solid rgba(113, 237, 218, 0.12)',
    background: 'linear-gradient(135deg, rgba(12, 28, 35, 0.98), rgba(8, 18, 24, 0.98))',
    height: 64,
    width: 384,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.28)',
  },
  heading: {
    fontSize: 17,
    color: '#f1fbfa',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: 800,
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
