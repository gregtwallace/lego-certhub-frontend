import { type FC } from 'react';

import useTheme from './hooks/useTheme';

import { Box, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import IconButton from './components/UI/Button/IconButton';

// no props

// component
const Footer: FC = () => {
  const { themeIsDarkMode, toggleThemeIsDarkMode } = useTheme();

  return (
    <Box
      component='footer'
      sx={{
        py: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) =>
          themeIsDarkMode ? theme.palette.grey[800] : theme.palette.grey[300],
      }}
    >
      <IconButton
        aria-label='toggletheme'
        tooltip='Toggle Theme'
        onClick={toggleThemeIsDarkMode}
        color='default'
        sx={{
          position: 'absolute',
          p: 0,
          mx: 1,
        }}
      >
        {themeIsDarkMode ? (
          <Brightness4Icon fontSize='small' />
        ) : (
          <Brightness7Icon fontSize='small' />
        )}
      </IconButton>

      <Typography variant='body2' align='center'>
        &copy; 2025 Greg T. Wallace
      </Typography>
    </Box>
  );
};

export default Footer;
