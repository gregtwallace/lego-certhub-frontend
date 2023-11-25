import { type FC, type Dispatch, type SetStateAction } from 'react';
import {
  type ordersResponseType,
  parseOrdersResponseType,
  type orderResponseType,
  parseOrderResponseType,
} from '../../../../../types/api';
import { type frontendErrorType } from '../../../../../types/frontend';
import { type useAxiosSendReturnType } from '../../../../../hooks/useAxiosSend';
import { type headerType } from '../../../../UI/TableMui/TableHeaderRow';

import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import { Link } from '@mui/material';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import { queryParser } from '../../../../UI/TableMui/query';
import { convertUnixTime } from '../../../../../helpers/time';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ApiLoading from '../../../../UI/Api/ApiLoading';
import ApiError from '../../../../UI/Api/ApiError';
import Button from '../../../../UI/Button/Button';
import TableContainer from '../../../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../../../UI/TitleBar/TitleBar';
import TablePagination from '../../../../UI/TableMui/TablePagination';

// table headers and sortable param
const tableHeaders: headerType[] = [
  {
    id: 'created_at',
    label: 'Created At',
    sortable: true,
  },
  {
    id: 'valid_to',
    label: 'Valid To',
    sortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    id: 'keyname',
    label: 'Key',
    sortable: true,
  },
  {
    id: 'actions',
    label: 'Actions',
    sortable: false,
  },
];

// func for if a unix timestamp is expired
const isExpired = (unixTime: number): boolean => Date.now() / 1000 > unixTime;

// order type to use for status parsing
type orderStatusObj = {
  fulfillment_worker?: number | undefined;
  known_revoked: boolean;
  status: string;
  valid_to: number | null;
};

// calculate the order status value to display
const orderStatus = (order: orderStatusObj): string => {
  // if in order queue
  if (order.fulfillment_worker != undefined) {
    if (order.fulfillment_worker < 0) {
      return 'Waiting in Order Queue';
    }

    return 'With Order Worker ' + order.fulfillment_worker;
  }

  // if revoked
  if (order.known_revoked) {
    return 'Revoked';
  }

  // if expired
  if (order.status === 'valid' && order.valid_to && isExpired(order.valid_to)) {
    return 'Expired';
  }

  // anything else
  return order.status.charAt(0).toUpperCase() + order.status.slice(1);
};

type propTypes = {
  certId: number;
  setHasValidOrders: Dispatch<SetStateAction<boolean>>;
  useAxiosSend: useAxiosSendReturnType;
};

const Orders: FC<propTypes> = (props) => {
  const { certId, setHasValidOrders, useAxiosSend } = props;

  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(
    searchParams,
    'created_at',
    'desc',
    5
  );

  const { getState, updateGet } = useAxiosGet<ordersResponseType>(
    `/v1/certificates/${certId}/orders?${queryParams}`,
    parseOrdersResponseType
  );

  // set parent's hasValidOrders
  useEffect(() => {
    // func for if an order is usable (i.e. 'valid' + not revoked + not expired)
    const isUsable = (order: orderStatusObj): boolean =>
      order.status === 'valid' &&
      !order.known_revoked &&
      order.valid_to !== null &&
      !isExpired(order.valid_to);

    // check if any orders, and if any are usable
    if (
      setHasValidOrders &&
      getState.responseData &&
      getState.responseData.orders.length > 0 &&
      getState.responseData.orders.some(isUsable)
    ) {
      setHasValidOrders(true);
    } else {
      // no usable orders
      setHasValidOrders(false);
    }
  }, [setHasValidOrders, getState]);

  // action handlers
  // Rather than making another sendApi, use the parent component's.
  // This allows disabling the parent's buttons also
  const { axiosSendState, apiCall, downloadFile } = useAxiosSend;

  // state for download error display
  const [sendError, setSendError] = useState<frontendErrorType | undefined>(
    undefined
  );

  // download order pem
  const downloadClickHandler = (orderId: number): void => {
    downloadFile(`/v1/certificates/${certId}/orders/${orderId}/download`).then(
      ({ error }) => {
        setSendError(error);
      }
    );
  };

  // handler to place a new order
  const newOrderHandler = (): void => {
    apiCall<orderResponseType>(
      'POST',
      `/v1/certificates/${certId}/orders`,
      {},
      parseOrderResponseType
    ).then(({ error }) => {
      // set error result and update get (regardless of success/fail)
      setSendError(error);
      updateGet();
    });
  };

  // handler to retry an existing order that isn't valid or invalid
  const retryOrderHandler = (orderId: number): void => {
    apiCall<orderResponseType>(
      'POST',
      `/v1/certificates/${certId}/orders/${orderId}`,
      {},
      parseOrderResponseType
    ).then(({ error }) => {
      // set error result and update get (regardless of success/fail)
      setSendError(error);
      updateGet();
    });
  };

  // handler to revoke a valid order's certificate
  const revokeCertHandler = (orderId: number): void => {
    // TODO: add ability to specify revocation reason
    apiCall<orderResponseType>(
      'POST',
      `/v1/certificates/${certId}/orders/${orderId}/revoke`,
      {},
      parseOrderResponseType
    ).then(({ error }) => {
      // set error result and update get (regardless of success/fail)
      setSendError(error);
      updateGet();
    });
  };
  // action handlers -- end

  return (
    <TableContainer>
      <TitleBar title='ACME Orders' headerComponent='h3'>
        {getState.responseData && (
          <Button size='small' onClick={newOrderHandler}>
            Place New Order
          </Button>
        )}
      </TitleBar>

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {sendError && (
        <ApiError
          statusCode={sendError.statusCode}
          message={sendError.message}
        />
      )}

      {getState.responseData && (
        <>
          <Table size='small'>
            <TableHead>
              <TableHeaderRow headers={tableHeaders} />
            </TableHead>

            <TableBody>
              {getState.responseData.orders.map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell>{convertUnixTime(ord.created_at)}</TableCell>

                  <TableCell>{convertUnixTime(ord.valid_to)}</TableCell>

                  <TableCell>{orderStatus(ord)}</TableCell>

                  <TableCell>
                    {ord.finalized_key !== null && (
                      <Link
                        component={RouterLink}
                        to={`/privatekeys/${ord.finalized_key.id}`}
                      >
                        {ord.finalized_key.name}
                      </Link>
                    )}
                  </TableCell>

                  <TableCell>
                    {ord.status !== 'valid' &&
                      ord.status !== 'invalid' &&
                      ord.fulfillment_worker === undefined && (
                        <Button
                          size='small'
                          color='info'
                          disabled={axiosSendState.isSending}
                          onClick={(_event) => retryOrderHandler(ord.id)}
                        >
                          Retry
                        </Button>
                      )}

                    {ord.status === 'valid' &&
                      !ord.known_revoked &&
                      ord.valid_to !== null &&
                      !isExpired(ord.valid_to) && (
                        <>
                          <Button
                            size='small'
                            color='primary'
                            sx={{ mr: 1 }}
                            onClick={() => downloadClickHandler(ord.id)}
                            disabled={axiosSendState.isSending}
                          >
                            Download
                          </Button>

                          <Button
                            size='small'
                            disabled={axiosSendState.isSending}
                            onClick={(_event) => revokeCertHandler(ord.id)}
                          >
                            Revoke
                          </Button>
                        </>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={getState.responseData.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default Orders;
