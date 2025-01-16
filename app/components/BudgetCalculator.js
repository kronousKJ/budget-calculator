'use client';
import React, { useState, useEffect } from 'react';
import { Trash2, Download } from 'lucide-react';

const BudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState(1000000);
  const [expenses, setExpenses] = useState([]);
  const [exchangeRates] = useState({
    USD: 1300,
    EUR: 1400,
    GBP: 1600,
    KRW: 1
  });
