import React, { useState, useEffect } from 'react';

import {AxiosResponse} from 'axios';

import { format } from 'date-fns-tz';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      await api.get('/transactions').then((response:AxiosResponse<any>)=>{
        console.log(response.data);
        if(response.data){
        setTransactions(response.data.transactions);
        setBalance(response.data.balance);
        }
      });
    }

    loadTransactions();
  }, []);

  const formatDate = (date: Date): string => 
    format(new Date(date), 'dd/MM/yyyy', {
      timeZone: 'America/Sao_Paulo',
    }).toString();
  


  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(parseInt(balance.income,10))}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formatValue(parseInt(balance.outcome,10))}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(parseInt(balance.total,10))}</h1>
          </Card>
        </CardContainer>

      {transactions.length > 0 && 
        (<TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

          {transactions.map((transaction: Transaction) => (
            <tbody key={transaction.id}>
              <tr>
                <td className="title">{transaction.title}</td>
                <td className={transaction.type === 'income' ? 'income' : 'outcome'}>{transaction.type === 'income' ? formatValue(transaction.value) : `- ${formatValue(transaction.value)}`}</td>
                <td>{transaction.category.title}</td>
                <td>{formatDate(transaction.created_at)}</td>
              </tr>
            </tbody>
          ))}
          </table>
        </TableContainer>
      )}
      </Container>
    </>
  );
};

export default Dashboard;
