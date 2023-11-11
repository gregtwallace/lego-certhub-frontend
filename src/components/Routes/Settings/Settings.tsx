import { type FC } from 'react';

import GridContainer from '../../UI/Grid/GridContainer';
import GridItemThird from '../../UI/Grid/GridItemThird';

import TitleBar from '../../UI/TitleBar/TitleBar';
import ChangePassword from './ChangePassword';
import BackendStatus from './BackendStatus';
import FrontendStatus from './FrontendStatus';
import NewVersionInfo from './NewVersionInfo';
import Shutdown from './Shutdown';

const Settings: FC = () => {
  return (
    <>
      <TitleBar title='Settings' />

      <GridContainer>
        <GridItemThird>
          <FrontendStatus />
        </GridItemThird>

        <GridItemThird>
          <BackendStatus />
        </GridItemThird>

        <GridItemThird>
          <ChangePassword />
        </GridItemThird>

        <GridItemThird>
          <NewVersionInfo />
        </GridItemThird>

        <GridItemThird>
          <Shutdown />
        </GridItemThird>
      </GridContainer>
    </>
  );
};

export default Settings;