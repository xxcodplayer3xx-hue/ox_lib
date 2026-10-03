import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'left',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    border: '1px solid rgba(177, 255, 239, 0.18)',
    borderBottom: '1px solid rgba(177, 255, 239, 0.1)',
    background: 'linear-gradient(135deg, rgba(15, 27, 31, 0.99), rgba(7, 16, 20, 0.99))',
    height: 68,
    width: 400,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0 22px',
    boxShadow: '0 18px 36px rgba(0, 0, 0, 0.34)',
  },
  heading: {
    fontSize: 15,
    color: '#f1fffc',
    letterSpacing: 1.4,
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
