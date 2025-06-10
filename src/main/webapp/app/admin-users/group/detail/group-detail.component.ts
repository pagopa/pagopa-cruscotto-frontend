import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';
import { IGroup } from '../group.model';
import { CdkTree, CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IPermission } from '../../permission/permission.model';
import { IFunction } from '../../function/function.model';
import { Authority } from 'app/config/authority.constants';

function flattenNodes(nodes: IFunction[]): IPermission[] {
  const flattenedNodes = [];
  for (const node of nodes) {
    flattenedNodes.push(node);
    if (node.authPermissions) {
      flattenedNodes.push(...flattenNodes(node.authPermissions));
    }
  }
  return flattenedNodes;
}

@Component({
  selector: 'jhi-auth-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
  imports: [
    SharedModule,
    MatIconButton,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatListModule,
    MatLineModule,
    MatIconModule,
    CdkTreeModule,
  ],
})
export class GroupDetailComponent implements OnInit {
  group: IGroup | null = null;

  @ViewChild(CdkTree) tree!: CdkTree<IFunction>;

  childrenAccessor = (dataNode: IFunction) => dataNode.authPermissions ?? [];

  dataSource = new MatTreeNestedDataSource<any>();

  protected readonly Authority = Authority;

  protected readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authGroup }) => {
      this.group = authGroup;
      if (authGroup) {
        this.dataSource.data = authGroup.authFunctions ?? [];
      }
    });
  }

  hasChild = (_: number, node: IFunction) => !!node.authPermissions && node.authPermissions.length > 0;

  getParentNode(node: IFunction) {
    for (const parent of flattenNodes(this.group?.authFunctions ?? [])) {
      if (parent.authFunctions?.includes(node)) {
        return parent;
      }
    }

    return null;
  }

  previousState(): void {
    window.history.back();
  }
}
