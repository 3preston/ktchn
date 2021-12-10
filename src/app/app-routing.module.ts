import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
      },
      {
        path: ':signup',
        loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
      },
    ]
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: ':userId',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      }
    ]
  },
  {
    path: 'details',
    children: [
      {
        path: '',
        loadChildren: () => import('./recipe-detail/recipe-detail.module').then( m=> m.RecipeDetailModule)
      },
      {
        path: ':recipeId',
        loadChildren: () => import('./recipe-detail/recipe-detail.module').then( m=> m.RecipeDetailModule)
      },
      {
        path: ':recipeId/:edit',
        loadChildren: () => import('./recipe-detail/recipe-detail.module').then( m=> m.RecipeDetailModule)
      }
    ]
  },
  {
    path: 'cookbook',
    children: [
      {
        path: '',
        loadChildren: () => import('./cookbook/cookbook.module').then( m=> m.CookbookPageModule)
      },
      {
        path: ':cookbookId/:chefId',
        loadChildren: () => import('./cookbook/cookbook.module').then( m=> m.CookbookPageModule)
      },
      {
        path: ':cookbookId/:chefId/:edit',
        loadChildren: () => import('./cookbook/cookbook.module').then( m=> m.CookbookPageModule)
      }
    ]
  },
  {
    path: 'contact',
    children: [
      {
        path: '',
        loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule)
      },
      {
        path: ':apply',
        loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule)
      },
    ]
  },
  {
    path: 'legal',
    loadChildren: () => import('./legal/legal.module').then( m => m.LegalPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyComponentModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
