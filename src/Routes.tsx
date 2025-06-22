import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RootLayout from "./pages/Root";
import UserPage from "./pages/UserPage";
import PostsPage from "./pages/PostsPage";
import AlbumPage from "./pages/AlbumPage";
import FavoritesPage from "./pages/FavoritesPage";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: "users/:userId",
                element: <UserPage/>,
            },
            {
                path: "users/:userId/posts/:postId",
                element: <PostsPage/>,
            },
            {
                path: "users/:userId/albums/:albumId",
                element: <AlbumPage />,
            },
            {
                path: "favorites",
                element: <FavoritesPage/>
            }
        ]
    },
];

const router = createBrowserRouter(routes);

export default router;