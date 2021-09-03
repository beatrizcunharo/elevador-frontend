import React from 'react';
import Service from '../../Service';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: '30rem',
        height: '30rem',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        margin: '150px 0px 0px 650px',
        padding: theme.spacing(2, 4, 3)
    },
    table: {
        minWidth: 400
    }
}));

export default function () {
    const classes = useStyles();
    const historico = Service.buscarTodos();

    const body = (
        <div className={classes.paper}>
            <TableContainer component={Paper}>
                <Table className={classes.table} size='small' aria-label='a dense table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Andar</TableCell>
                            <TableCell align='center'>Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historico
                            ? historico.map((coluna) => {
                                  const { id, andar, data } = coluna;
                                  <TableRow key={id}>
                                      <TableCell component='th' scope='row'>
                                          {andar}
                                      </TableCell>
                                      <TableCell align='right'>{data}</TableCell>
                                  </TableRow>;
                              })
                            : ''}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );

    return body;
}
