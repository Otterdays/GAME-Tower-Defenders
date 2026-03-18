import type { Point } from '../types/game';

export function findPath(gridSize: number, start: Point, end: Point, towers: Point[]): Point[] | null {
  const openSet = new Set<string>();
  const closedSet = new Set<string>();
  
  const startKey = `${start.x},${start.z}`;
  const endKey = `${end.x},${end.z}`;
  
  openSet.add(startKey);

  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startKey, 0);

  const fScore = new Map<string, number>();
  fScore.set(startKey, heuristic(start, end));

  const towerSet = new Set(towers.map(t => `${t.x},${t.z}`));

  while (openSet.size > 0) {
    let currentKey = getLowestFScore(openSet, fScore);
    
    if (currentKey === endKey) {
      return reconstructPath(cameFrom, currentKey);
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    const currentPoint = keyToPoint(currentKey);
    const neighbors = getNeighbors(currentPoint, gridSize);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.z}`;
      
      if (closedSet.has(neighborKey)) continue;
      
      // Can't walk through towers
      if (towerSet.has(neighborKey)) continue;

      const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + 1;

      if (!openSet.has(neighborKey)) {
        openSet.add(neighborKey);
      } else if (tentativeGScore >= (gScore.get(neighborKey) ?? Infinity)) {
        continue;
      }

      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, tentativeGScore);
      fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
    }
  }

  // No path found
  return null;
}

function heuristic(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
}

function getLowestFScore(openSet: Set<string>, fScore: Map<string, number>): string {
  let lowestNode = '';
  let lowestScore = Infinity;
  for (const node of openSet) {
    const score = fScore.get(node) ?? Infinity;
    if (score < lowestScore) {
      lowestScore = score;
      lowestNode = node;
    }
  }
  return lowestNode;
}

function getNeighbors(p: Point, gridSize: number): Point[] {
  const neighbors: Point[] = [];
  const dirs = [
    { x: 0, z: -1 }, // up
    { x: 0, z: 1 },  // down
    { x: -1, z: 0 }, // left
    { x: 1, z: 0 },  // right
  ];

  for (const dir of dirs) {
    const nx = p.x + dir.x;
    const nz = p.z + dir.z;
    if (nx >= 0 && nx < gridSize && nz >= 0 && nz < gridSize) {
      neighbors.push({ x: nx, z: nz });
    }
  }
  return neighbors;
}

function keyToPoint(key: string): Point {
  const [x, z] = key.split(',').map(Number);
  return { x, z };
}

function reconstructPath(cameFrom: Map<string, string>, currentKey: string): Point[] {
  const path: Point[] = [keyToPoint(currentKey)];
  while (cameFrom.has(currentKey)) {
    currentKey = cameFrom.get(currentKey)!;
    path.unshift(keyToPoint(currentKey));
  }
  return path;
}
