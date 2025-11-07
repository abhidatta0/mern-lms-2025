import { Button } from '@/components/ui/button';
import { ShoppingCart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
    courseId: string,
}
export default function NotPurchased({courseId}:Props) {

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Access Locked
        </h1>
        
        <p className="text-slate-600 mb-8">
          You have not bought this course
        </p>
        
        <div className="bg-slate-50 border-l-4 border-amber-400 p-4 mb-8 text-left rounded">
          <p className="text-sm text-slate-700">
            <strong>Unlock premium content</strong> by purchasing this course to get full access to all lessons .
          </p>
        </div>
        
        <Button className='w-full mb-3' onClick={()=> navigate(`/course/details/${courseId}`)}>
          <ShoppingCart />
          Buy Course Now
        </Button>
        
        <Button className='w-full' variant='outline' onClick={()=> navigate(`/courses`)}> 
          Explore Other Courses
        </Button>
      </div>
    </div>
  );
}