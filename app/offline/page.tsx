export default function OfflinePage() {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center'>
      <div className='max-w-md space-y-6'>
        <div className='text-8xl'>📴</div>
        <h1 className='text-4xl font-bold text-gray-800'>You are Offline</h1>
        <p className='text-gray-600 text-lg'>
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
