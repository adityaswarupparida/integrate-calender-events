import './App.css'

function App() {
	const authenticateGoogle = () => {
		
	}
	return (
		<div className='flex justify-center items-center h-screen bg-gradient-to-bl from-cyan-200 via-cyan-50 to-cyan-300'>
			<div className="w-1/4 h-1/2 py-12 px-8 border border-gray-100 bg-white rounded-md shadow-2xl">
				<div className="flex flex-col items-center justify-around h-full">
					<div className="flex flex-col justify-center items-center">
						<h1 className="font-sans text-4xl">Welcome to CalEvents</h1>
						<p className="font-light text-md">Your one place stop for Calender Events</p>
					</div>
					<button className="flex gap-2 items-center justify-center border p-2 rounded-md w-full border-gray-200 hover:bg-gray-100 cursor-pointer"
						onClick={authenticateGoogle}
					>
						<img src='https://www.svgrepo.com/show/303108/google-icon-logo.svg' className="h-6"/>
						Sign with Google
					</button>
				</div>
			</div>
		</div>
	)
}

export default App