import React from 'react';

export interface IAuthorization {
	status: boolean,
	user: IUser,
	token: string,
	setAuthorization: (auth: Omit<IAuthorization, "setAuthorization">) => void,
}

export interface IUser {
	id: string,
	username: string,
	role: IRole
}

export interface IRole {
	name: string,
}

export const AuthorizationContext = React.createContext<IAuthorization>({
	status: false,
	user: {
		id: '',
		username: '',
		role: {
			name: '',
		}
	},
	token: '',
	setAuthorization: () => {}
});