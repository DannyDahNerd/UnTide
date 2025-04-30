

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
    followers?: string[];  
    following?: string[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location: string;
    latitude: number;
    longitude: number;
    tags?: string;
    date: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: string;
    file: File[];
    location: string;
    latitude: number;
    longitude: number;
    tags?: string;
    date: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    imageId: string;
  followers?: string[];  
  following?: string[];
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: ()=>Promise<boolean>;
  };
  