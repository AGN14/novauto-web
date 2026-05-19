import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  fonctionnalites = [
    {
      icone: '◈',
      titre: 'Vendeurs Certifiés',
      description: 'Chaque vendeur fait l\'objet d\'un contrôle rigoureux de son IFU et de son identité pour garantir des transactions fiables.'
    },
    {
      icone: '◎',
      titre: 'Réservation Sécurisée',
      description: 'Bloquez votre véhicule favori via un acompte sécurisé. Vos fonds sont protégés jusqu\'à l\'inspection finale.'
    },
    {
      icone: '⬡',
      titre: 'Expertise Douanière',
      description: 'Simulation en temps réel des frais de douane basés sur les grilles officielles de la DGDDI Bénin.'
    },
  ];

  annonces = [
    {
      titre: 'Toyota Prado',
      annee: '2023',
      km: '12 400',
      prix: '45 500 000',
      statut: 'DÉDOUANÉ',
      vin: true,
      photo: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&q=80'
    },
    {
      titre: 'Porsche Cayenne S',
      annee: '2021',
      km: '45 000',
      prix: '32 000 000',
      statut: 'DÉDOUANÉ',
      vin: true,
      photo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'
    },
    {
      titre: 'Ford Raptor',
      annee: '2022',
      km: '28 100',
      prix: '58 200 000',
      statut: 'EN TRANSIT',
      vin: true,
      photo: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80'
    },
    {
      titre: 'Mercedes GLB 250',
      annee: '2022',
      km: '31 500',
      prix: '27 800 000',
      statut: 'DÉDOUANÉ',
      vin: true,
      photo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
    },
    {
      titre: 'BMW X5 xDrive',
      annee: '2021',
      km: '38 000',
      prix: '42 000 000',
      statut: 'EN TRANSIT',
      vin: true,
      photo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'
    },
    {
      titre: 'Toyota Corolla Cross',
      annee: '2023',
      km: '15 000',
      prix: '19 500 000',
      statut: 'DÉDOUANÉ',
      vin: false,
      photo: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80'
    },
  ];
}