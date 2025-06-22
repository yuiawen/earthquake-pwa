
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <Card className="mx-4 border-red-200 bg-red-50">
      <CardContent className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Gagal Memuat Data
        </h3>
        <p className="text-red-600 mb-4">{message}</p>
        <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700">
          <RotateCcw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
        <p className="text-xs text-red-500 mt-4">
          Jika masih offline, data terakhir akan ditampilkan
        </p>
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
