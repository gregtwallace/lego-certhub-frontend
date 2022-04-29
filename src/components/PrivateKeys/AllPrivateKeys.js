import { Link, useNavigate } from 'react-router-dom';

import useApiRequest from '../../hooks/useApiRequest';
import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Table from '../UI/Table/Table';
import TableBody from '../UI/Table/TableBody';
import TableData from '../UI/Table/TableData';
import TableHead from '../UI/Table/TableHead';
import TableHeader from '../UI/Table/TableHeader';
import TableRow from '../UI/Table/TableRow';
import Button from '../UI/Button/Button';
import H2Header from '../UI/Header/H2Header';

const AllPrivateKeys = () => {
  const navigate = useNavigate();

  const [state] = useApiRequest('/v1/privatekeys', 'private_keys');

  const newClickHandler = (event) => {
    event.preventDefault();
    navigate('-1');
  };

  if (state.errorMessage) {
    return <ApiError>{state.errorMessage}</ApiError>;
  } else if (!state.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Private Keys'>
          <Button type='submit' onClick={newClickHandler}>
            New
          </Button>
        </H2Header>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Name</TableHeader>
              <TableHeader scope='col'>Description</TableHeader>
              <TableHeader scope='col'>Algorithm</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.private_keys.map((m) => (
              <TableRow key={m.id}>
                <TableHeader scope='row'>
                  <Link to={'/privatekeys/' + m.id}>{m.name}</Link>
                </TableHeader>
                <TableData>{m.description}</TableData>
                <TableData>{m.algorithm.name}</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default AllPrivateKeys;
