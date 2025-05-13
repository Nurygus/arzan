export interface AuthSignUpRequest {
  name: string;
  password: string;
  phone: string;
}

export interface AuthAccountVerifyRequest {
  phone: string;
  statpass: string;
  recover: boolean;
}

export interface AuthPasswordRecoveryRequest {
  phone: string;
  password: string;
}

export interface AuthAccountVerifyCheckRequest {
  phone: string;
}

export interface AuthAccountLoginRequest {
  phone: string;
  password: string;
}
