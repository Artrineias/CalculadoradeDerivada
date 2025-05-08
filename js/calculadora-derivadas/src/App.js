import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DerivativeCalculator() {
  const [functionInput, setFunctionInput] = useState('');
  const [result, setResult] = useState({ first: '', second: '', limit: '' });

  const handleCalculate = async () => {
    try {
      const response = await fetch('/api/derivatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ function: functionInput })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro ao calcular derivadas:', error);
    }
  };

  return (
    <motion.div
      className='flex flex-col items-center p-10 gap-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className='w-full max-w-lg p-4 shadow-lg'>
        <CardContent className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-center'>Calculadora de Derivadas</h2>
          <Input
            placeholder='Digite a função (ex: x^2 + 3x + 2)'
            value={functionInput}
            onChange={(e) => setFunctionInput(e.target.value)}
          />
          <Button onClick={handleCalculate} className='w-full'>
            Calcular
          </Button>
          <div className='mt-4'>
            <p><strong>1ª Derivada:</strong> {result.first}</p>
            <p><strong>2ª Derivada:</strong> {result.second}</p>
            <p><strong>Ponto Limite:</strong> {result.limit}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
