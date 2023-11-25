import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PedidosService } from './pedidos.service';
import { Pedido } from '../models/pedido';
import { Produto } from '../models/produto';

describe('PedidosService', () => {
  let service: PedidosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PedidosService]
    });

    service = TestBed.inject(PedidosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve orders from the API via GET', () => {
    const mockOrders: Pedido[] = [
      { id: 1, obs: 'Pedido 1', produtos: [] },
      { id: 2, obs: 'Pedido 2', produtos: [] }
    ];

    service.listAll().subscribe((orders) => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedido');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should save an order via POST', () => {
    const newOrder: Pedido = { id: 3, obs: 'Novo Pedido', produtos: [] };

    service.save(newOrder).subscribe((order) => {
      expect(order).toEqual(newOrder);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedido');
    expect(req.request.method).toBe('POST');
    req.flush(newOrder);
  });

  it('should handle an error when calling exemploErro', () => {
    service.exemploErro().subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error.status).toBe(500); // Assuming a 500 error for example purposes
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/pedido/erro');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });
});