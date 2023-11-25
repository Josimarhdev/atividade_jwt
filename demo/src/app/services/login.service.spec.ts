import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoginService } from './login.service';
import { LoginComponent } from '../components/sistema/login/login.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Login } from '../models/login';
import { User } from '../models/user';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoginComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [LoginService], // Add the service as a provider
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unexpected requests are made
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully', () => {
    const loginMock: Login = { username: 'testuser', password: 'testpassword' };
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'admin', // Include role property if it's part of the User type
      token: 'mockToken', // Include token property if it's part of the User type
    };
    
    // Use this mock user object in your test
    service.logar(loginMock).subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    service.logar(loginMock).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(service.API);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should handle login error', () => {
    const loginMock: Login = { username: 'invaliduser', password: 'invalidpassword' };

    service.logar(loginMock).subscribe(
      (user) => {
        // If the call succeeds, this should not run. Fail the test if it does.
        fail('Expected login to fail');
      },
      (error) => {
        expect(error.status).toBe(401); // Assuming a 401 Unauthorized status for invalid login
      }
    );

    const req = httpMock.expectOne(service.API);
    expect(req.request.method).toBe('POST');
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
  });

  it('should log out successfully', () => {
    service.deslogar().subscribe();

    const req = httpMock.expectOne(`${service.API}/deslogar`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should add token to localStorage', () => {
    const token = 'testToken';
    service.addToken(token);
    const storedToken = localStorage.getItem('token');
    expect(storedToken).toEqual(token);
  });

  it('should remove token from localStorage', () => {
    const token = 'testToken';
    localStorage.setItem('token', token);
    service.removerToken();
    const storedToken = localStorage.getItem('token');
    expect(storedToken).toBeNull();
  });

  it('should get token from localStorage', () => {
    const token = 'testToken';
    localStorage.setItem('token', token);
    const retrievedToken = service.getToken();
    expect(retrievedToken).toEqual(token);
  });

  it('should check user permission successfully', () => {
    const testToken = 'mockToken'; // Mock token with required permissions
    localStorage.setItem('token', testToken);
    const roleToCheck = 'admin'; // Role to check against

    const permission = service.hasPermission(roleToCheck);
    expect(permission).toBeTruthy();
  });

  it('should handle error when checking user permission', () => {
    const invalidToken = 'invalidToken'; // Invalid token format
    localStorage.setItem('token', invalidToken);
    const roleToCheck = 'admin'; // Role to check against

    const permission = service.hasPermission(roleToCheck);
    expect(permission).toBeFalsy();
  });
});
