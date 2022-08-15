import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import useAxiosSend from './hooks/useAxiosSend';

import Dashboard from './components/Dashboard';
import Login from './components/Authentication/Login';
import AllACMEAccounts from './components/ACMEAccounts/AllACMEAccounts';
import AddOneACMEAccount from './components/ACMEAccounts/OneACMEAccount/AddOneACMEAccount';
import EditOneACMEAccount from './components/ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import ChangeAccountEmail from './components/ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import AllPrivateKeys from './components/PrivateKeys/AllPrivateKeys';
import AddOnePrivateKey from './components/PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import EditOnePrivateKey from './components/PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import AllCertificates from './components/Certificates/AllCertificates';
import ViewOneCert from './components/Certificates/OneCert/ViewOneCert';
import EditOneCert from './components/Certificates/OneCert/EditOneCert';
import AddOneCert from './components/Certificates/OneCert/AddOneCert';
import H1Header from './components/UI/Header/H1Header';

export const newId = -1;

const App = () => {
  const { setAuth } = useAuth();
  const [, sendData ] = useAxiosSend();

  // check for 'logged_in' cookie
  const loggedIn = document.cookie.match(
    /^(.*;)?\s*logged_in\s*=\s*[^;]+(.*)?$/
  );

  // logout handler
  // clear 'logged_in' cookie on front end (NOTE: does NOT clear the refresh_token cookie!)
  // send logout to backend so backend deletes the refresh_token on its end
  const logoutHandler = () => {
    sendData(`/v1/auth/logout`, 'POST', null, true).then((success) => {
      if (success) {
        // set cookie to immediately expire
        document.cookie = 'logged_in=; Max-Age=0';
        // update auth state
        setAuth({});
      }
    });
  };

  // if not logged in
  if (!loggedIn) {
    return <Login />;
  } else {
    // if logged in
    return (
      <div className='container'>
        <H1Header className='ml-3 my-3' h1='LeGo CertHub'></H1Header>

        <Router>
          <div className='row'>
            <div className='col-md-3'>
              <nav>
                <ul className='list-group'>
                  <li className='list-group-item'>
                    <Link to='/'>Dashboard</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/privatekeys'>Private Keys</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/acmeaccounts'>ACME Accounts</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/certificates'>Certificates</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/settings'>Settings</Link>
                  </li>
                  <li className='list-group-item'>
                    <a href={'#'} onClick={logoutHandler}>
                      Logout
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className='col-md-9'>
              <Routes>
                <Route
                  path={`/privatekeys/${newId}`}
                  element={<AddOnePrivateKey />}
                />
                <Route
                  path='/privatekeys/:id'
                  element={<EditOnePrivateKey />}
                />
                <Route path='/privatekeys' element={<AllPrivateKeys />} />
                <Route
                  path={`/acmeaccounts/${newId}`}
                  element={<AddOneACMEAccount />}
                />
                <Route
                  path='/acmeaccounts/:id'
                  element={<EditOneACMEAccount />}
                />
                <Route
                  path='/acmeaccounts/:id/email'
                  element={<ChangeAccountEmail />}
                />
                <Route path='/acmeaccounts' element={<AllACMEAccounts />} />
                <Route path='/certificates' element={<AllCertificates />} />
                <Route path='/certificates/:id' element={<ViewOneCert />} />
                <Route
                  path='/certificates/:id/edit'
                  element={<EditOneCert />}
                />
                <Route
                  path={`/certificates/${newId}`}
                  element={<AddOneCert />}
                />
                `// TODO: Dashboard, Settings //`
                <Route path='/' element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div>
    );
  }
};

export default App;
