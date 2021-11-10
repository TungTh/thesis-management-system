/**
        '/*******************************',
        ' *                             *',
        ' *          TYPE DEFS          *',
        ' *                             *',
        ' *******************************'
    */
/**
 * **defaultDef**
 */
export interface GQLQuery {
  default?: string;
}

export interface GQLNamespace {
  name: string;
  deployments?: Array<GQLDeployment>;
  statefulSets?: Array<GQLStatefulSet>;
  pods?: Array<GQLPod>;
  configMaps?: Array<GQLConfigMap>;
  secrets?: Array<GQLSecret>;
  services?: Array<GQLService>;
}

export interface GQLDeployment {
  meta: GQLMetadata;
  replicas: number;
  labelSelector: GQLLabel;
  template: GQLPodTemplate;
  yaml: string;
}

export interface GQLMetadata {
  name: string;
  uid: string;
  namespace: GQLNamespace;
}

export interface GQLLabel {
  name: string;
  value: string;
}

export interface GQLPodTemplate {
  meta: GQLMetadata;
  containers: Array<GQLContainer>;
}

export interface GQLContainer {
  name: string;
  image: string;
  resources?: GQLResourceRequirements;
  ports?: Array<GQLContainerPort>;
  env?: Array<GQLEnvVar>;
}

export interface GQLResourceRequirements {
  limits?: GQLResource;
  requests?: GQLResource;
}

export interface GQLResource {
  cpu?: string;
  memory?: string;
}

export interface GQLContainerPort {
  containterPort: number;
  name?: string;
  protocol?: GQLPortProtocol;
}

export enum GQLPortProtocol {
  UDP = 'UDP',
  TCP = 'TCP',
  SCTP = 'SCTP'
}

export interface GQLEnvVar {
  name: string;
  value?: string;
  valueFrom?: GQLEnvVarSrc;
}

export interface GQLEnvVarSrc {
  configMapKeyRef?: GQLKeyRef;
  secretKeyRef?: GQLKeyRef;
}

export interface GQLKeyRef {
  name: string;
  key: string;
}

export interface GQLStatefulSet {
  meta: GQLMetadata;
  replicas: number;
  labelSelector?: Array<GQLLabel>;
  serviceName: string;
  yaml: string;
}

export interface GQLPod {
  meta: GQLMetadata;
  hostIP: string;
  podIP: string;
  status: string;
}

export interface GQLConfigMap {
  meta: GQLMetadata;
  data?: Array<GQLMapValue>;
  yaml: string;
}

export interface GQLMapValue {
  key: string;
  value: string;
}

export interface GQLSecret {
  meta: GQLMetadata;
  type: string;
  data?: Array<GQLMapValue>;
  yaml: string;
}

export interface GQLService {
  meta: GQLMetadata;
  type: GQLServiceType;
  selector: Array<GQLLabel>;
  ports?: Array<GQLServicePort>;
  yaml: string;
}

export enum GQLServiceType {
  ExternalName = 'ExternalName',
  ClusterIP = 'ClusterIP',
  NodePort = 'NodePort',
  LoadBalancer = 'LoadBalancer'
}

export interface GQLServicePort {
  name: string;
  protocol: string;
  port: string;
  targetPort: string;
  nodePort: string;
}

export interface GQLServiceInput {
  name: string;
  type: GQLServiceType;
}

export interface GQLPersistentVolumeClaim {
  meta: GQLMetadata;
  volumeName: string;
  volumeMode: string;
  accessMode: Array<GQLVolumeAccessMode>;
  resources?: GQLResourceRequirements;
}

export enum GQLVolumeAccessMode {
  ReadWriteOnce = 'ReadWriteOnce',
  ReadOnlyMany = 'ReadOnlyMany',
  ReadWriteMany = 'ReadWriteMany',
  ReadWriteOncePod = 'ReadWriteOncePod'
}

