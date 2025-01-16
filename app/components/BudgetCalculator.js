'use client';
import React, { useState } from 'react';
import { Trash2, Download } from 'lucide-react';

const BudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState(1000000);
  const [expenses, setExpenses] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1300,
    EUR: 1400,
    GBP: 1600,
    KRW: 1
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    currency: 'KRW',
    category: '일상생활 💫',
    date: new Date().toISOString().slice(0, 10)
  });

  // 카테고리 목록
  const categories = [
    '일상생활 💫',
    '식사/카페 ☕',
    '교통/차량 🚗',
    '문화생활 🎬',
    '쇼핑/패션 👜',
    '의료/건강 🏥',
    '교육/자기계발 📚',
    '대출/부채 💰',
    '저축/투자 💎',
    '기타 ✨'
  ];

  // 숫자를 한글 금액으로 변환하는 함수
  const convertToKoreanNumber = (number) => {
    const units = ['', '만 ', '억 ', '조 '];
    const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const positions = ['', '십', '백', '천'];
    
    if (number === 0) return '영 원';
    if (!number) return '';
    
    let result = '';
    let unitIndex = 0;
    let numStr = Math.floor(number).toString();
    
    while (numStr.length > 0) {
      let segment = numStr.slice(-4);
      numStr = numStr.slice(0, -4);
      
      let segmentResult = '';
      for (let i = 0; i < segment.length; i++) {
        const digit = parseInt(segment[i]);
        if (digit !== 0) {
          segmentResult += (digit !== 1 || positions[segment.length - 1 - i] === '') 
            ? digits[digit] 
            : '';
          segmentResult += positions[segment.length - 1 - i];
        }
      }
      
      if (segmentResult !== '') {
        result = segmentResult + units[unitIndex] + result;
      }
      unitIndex++;
    }
    
    return result + '원';
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const amountInKRW = Number(newExpense.amount) * exchangeRates[newExpense.currency];
      setExpenses([...expenses, {
        ...newExpense,
        id: Date.now(),
        amountInKRW
      }]);
      setNewExpense({
        ...newExpense,
        description: '',
        amount: '',
      });
    }
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const downloadCSV = () => {
    const headers = ['날짜', '설명', '금액', '통화', '원화환산액', '카테고리'];
    const csvData = expenses.map(e => [
      e.date,
      e.description,
      e.amount,
      e.currency,
      e.amountInKRW,
      e.category
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `예산_관리_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amountInKRW, 0);
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">예산 관리 💰</h1>
        
        {/* 빠른 계산 섹션 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">빠른 계산</h2>
            <span className="text-sm text-gray-500">금액을 입력하면 자동으로 환산됩니다</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              placeholder="금액 입력"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="col-span-2 p-2 border rounded-lg"
            />
            <select
              value={newExpense.currency}
              onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})}
              className="p-2 border rounded-lg"
            >
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          
          <div className="bg-white rounded-lg p-4 flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-600 mb-1">환산 금액:</div>
              <div className="text-xl font-bold text-gray-900">
                {newExpense.amount ? (Number(newExpense.amount) * exchangeRates[newExpense.currency]).toLocaleString() : 0} KRW
              </div>
              <div className="text-sm text-gray-500">
                {newExpense.amount ? convertToKoreanNumber(Number(newExpense.amount) * exchangeRates[newExpense.currency]) : '영 원'}
              </div>
            </div>
            <button
              onClick={addExpense}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              내역에 추가
            </button>
          </div>
        </div>

        {/* 예산 설정 섹션 */}
        <div className="mb-6">
          <div className="mb-2">
            <label className="text-sm font-medium text-gray-700">예산 설정</label>
          </div>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="w-full p-2 border rounded-lg mb-1"
          />
          <div className="text-sm text-gray-500 italic">
            {convertToKoreanNumber(totalBudget)}
          </div>
        </div>

        {/* 지출 입력 폼 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">새 지출 입력</h2>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <input
              className="col-span-2 p-2 border rounded-lg"
              placeholder="지출 내역"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
            <input
              type="number"
              placeholder="금액"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="p-2 border rounded-lg"
            />
            <select
              value={newExpense.currency}
              onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})}
              className="p-2 border rounded-lg"
            >
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="p-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              className="p-2 border rounded-lg"
            />
          </div>
          <button
            onClick={addExpense}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            추가하기
          </button>
        </div>

        {/* 내보내기 버튼 */}
        <div className="flex justify-end mb-6">
          <button
            onClick={downloadCSV}
            className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </button>
        </div>

        {/* 지출 목록 테이블 */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">내용</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">금액</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">원화 환산액</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{expense.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${expense.category.includes('대출/부채') ? 'bg-red-100 text-red-800' :
                        expense.category.includes('저축/투자') ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">
                    {Number(expense.amount).toLocaleString()} {expense.currency}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">
                    {expense.amountInKRW.toLocaleString()} KRW
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-right font-medium">총 지출:</td>
                <td className="px-4 py-3 text-right">
                  <div className="font-bold text-gray-900">{totalExpenses.toLocaleString()} KRW</div>
                  <div className="text-sm text-gray-500">{convertToKoreanNumber(totalExpenses)}</div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-right font-medium">남은 예산:</td>
                <td className="px-4 py-3 text-right">
                  <div className={`font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {remainingBudget.toLocaleString()} KRW
                  </div>
                  <div className="text-sm text-gray-500">{convertToKoreanNumber(remainingBudget)}</div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;