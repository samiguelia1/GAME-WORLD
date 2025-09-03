import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Games from './Games.jsx'
import GameDesciption from './GameDesciption.jsx'
import ReactDOM from 'react-dom/client'
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement:<h1 className='text-5xl font-bold text-center m-10 text-white'>Oops! Something went wrong.</h1>
    },
    {
        path: '/games',
        element: <Games />,
    },
    {
        path: '/games/:id',
        element: <GameDesciption />,
    },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
        <RouterProvider router={router}/>
)