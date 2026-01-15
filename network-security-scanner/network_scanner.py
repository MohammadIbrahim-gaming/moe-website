#!/usr/bin/env python3
"""
Local Network Security Scanner
A comprehensive tool for scanning local networks, detecting open ports,
identifying services, and performing basic security assessments.
"""

import socket
import subprocess
import ipaddress
import threading
import argparse
import json
import time
import platform
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Tuple, Optional

class NetworkSecurityScanner:
    """Main class for network security scanning operations."""
    
    # Common ports and their services
    COMMON_PORTS = {
        21: 'FTP',
        22: 'SSH',
        23: 'Telnet',
        25: 'SMTP',
        53: 'DNS',
        80: 'HTTP',
        110: 'POP3',
        143: 'IMAP',
        443: 'HTTPS',
        445: 'SMB',
        3306: 'MySQL',
        3389: 'RDP',
        5432: 'PostgreSQL',
        8080: 'HTTP-Proxy',
        8443: 'HTTPS-Alt'
    }
    
    # Potentially vulnerable ports
    VULNERABLE_PORTS = {
        21: 'FTP - Unencrypted file transfer',
        23: 'Telnet - Unencrypted remote access',
        80: 'HTTP - Unencrypted web traffic',
        143: 'IMAP - Potentially unencrypted email',
        3306: 'MySQL - Database access',
        5432: 'PostgreSQL - Database access'
    }
    
    def __init__(self, timeout: float = 1.0, max_threads: int = 50):
        """
        Initialize the scanner.
        
        Args:
            timeout: Socket timeout in seconds
            max_threads: Maximum number of concurrent threads
        """
        self.timeout = timeout
        self.max_threads = max_threads
        self.results = []
        self.lock = threading.Lock()
    
    def get_local_network(self) -> str:
        """
        Detect the local network subnet.
        
        Returns:
            Network subnet in CIDR notation (e.g., '192.168.1.0/24')
        """
        try:
            # Get default gateway and network interface
            if platform.system() == 'Windows':
                result = subprocess.run(['ipconfig'], capture_output=True, text=True)
                # Parse Windows output (simplified)
                return '192.168.1.0/24'  # Default fallback
            else:
                # Linux/Mac
                result = subprocess.run(['ip', 'route', 'get', '1'], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    # Try alternative method
                    result = subprocess.run(['route', '-n', 'get', 'default'], 
                                          capture_output=True, text=True)
                
                # Fallback: use common private network ranges
                hostname = socket.gethostname()
                local_ip = socket.gethostbyname(hostname)
                ip_obj = ipaddress.IPv4Address(local_ip)
                
                # Determine network based on private IP ranges
                if ip_obj.is_private:
                    if ipaddress.IPv4Network(f'{local_ip}/24', strict=False):
                        return f'{local_ip.rsplit(".", 1)[0]}.0/24'
                    elif ipaddress.IPv4Network(f'{local_ip}/16', strict=False):
                        return f'{local_ip.rsplit(".", 2)[0]}.0.0/16'
                
                return '192.168.1.0/24'  # Default fallback
        except Exception as e:
            print(f"[!] Error detecting network: {e}")
            return '192.168.1.0/24'  # Default fallback
    
    def ping_host(self, ip: str) -> bool:
        """
        Check if a host is alive using ping.
        
        Args:
            ip: IP address to ping
            
        Returns:
            True if host is alive, False otherwise
        """
        try:
            if platform.system() == 'Windows':
                result = subprocess.run(['ping', '-n', '1', '-w', '1000', ip],
                                      capture_output=True, timeout=2)
            else:
                result = subprocess.run(['ping', '-c', '1', '-W', '1', ip],
                                      capture_output=True, timeout=2)
            return result.returncode == 0
        except:
            return False
    
    def scan_port(self, ip: str, port: int) -> Optional[Dict]:
        """
        Scan a single port on a host.
        
        Args:
            ip: Target IP address
            port: Port number to scan
            
        Returns:
            Dictionary with port information if open, None otherwise
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(self.timeout)
            result = sock.connect_ex((ip, port))
            sock.close()
            
            if result == 0:
                service = self.COMMON_PORTS.get(port, 'Unknown')
                is_vulnerable = port in self.VULNERABLE_PORTS
                
                return {
                    'port': port,
                    'service': service,
                    'status': 'open',
                    'vulnerable': is_vulnerable,
                    'vulnerability_note': self.VULNERABLE_PORTS.get(port, '')
                }
        except Exception as e:
            pass
        return None
    
    def get_service_banner(self, ip: str, port: int) -> str:
        """
        Attempt to grab service banner.
        
        Args:
            ip: Target IP address
            port: Port number
            
        Returns:
            Banner string or empty string
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            sock.connect((ip, port))
            sock.send(b'HEAD / HTTP/1.1\r\n\r\n')
            banner = sock.recv(1024).decode('utf-8', errors='ignore')
            sock.close()
            return banner[:200].strip()  # Limit banner length
        except:
            return ''
    
    def scan_host(self, ip: str, ports: List[int] = None) -> Dict:
        """
        Scan a single host for open ports.
        
        Args:
            ip: Target IP address
            ports: List of ports to scan (defaults to common ports)
            
        Returns:
            Dictionary with host scan results
        """
        if ports is None:
            ports = list(self.COMMON_PORTS.keys())
        
        print(f"[*] Scanning {ip}...")
        
        # Check if host is alive
        is_alive = self.ping_host(ip)
        if not is_alive:
            return {
                'ip': ip,
                'status': 'down',
                'ports': [],
                'open_ports_count': 0,
                'vulnerable_ports_count': 0
            }
        
        open_ports = []
        
        # Scan ports with threading
        with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
            futures = {executor.submit(self.scan_port, ip, port): port for port in ports}
            
            for future in as_completed(futures):
                result = future.result()
                if result:
                    # Try to get banner
                    banner = self.get_service_banner(ip, result['port'])
                    result['banner'] = banner
                    open_ports.append(result)
        
        vulnerable_count = sum(1 for p in open_ports if p.get('vulnerable', False))
        
        return {
            'ip': ip,
            'status': 'up',
            'ports': sorted(open_ports, key=lambda x: x['port']),
            'open_ports_count': len(open_ports),
            'vulnerable_ports_count': vulnerable_count,
            'scan_time': datetime.now().isoformat()
        }
    
    def scan_network(self, network: str, ports: List[int] = None) -> List[Dict]:
        """
        Scan an entire network for hosts and open ports.
        
        Args:
            network: Network in CIDR notation (e.g., '192.168.1.0/24')
            ports: List of ports to scan
            
        Returns:
            List of scan results for each host
        """
        print(f"[*] Scanning network: {network}")
        print(f"[*] This may take a while...\n")
        
        try:
            network_obj = ipaddress.ip_network(network, strict=False)
            hosts = [str(ip) for ip in network_obj.hosts()]
        except ValueError as e:
            print(f"[!] Invalid network format: {e}")
            return []
        
        results = []
        
        # Scan hosts with threading
        with ThreadPoolExecutor(max_workers=min(20, len(hosts))) as executor:
            futures = {executor.submit(self.scan_host, host, ports): host for host in hosts}
            
            for future in as_completed(futures):
                result = future.result()
                if result['status'] == 'up':
                    results.append(result)
                    self.print_host_results(result)
        
        return results
    
    def print_host_results(self, result: Dict):
        """Print formatted results for a single host."""
        print(f"\n{'='*60}")
        print(f"Host: {result['ip']}")
        print(f"Status: {result['status'].upper()}")
        print(f"Open Ports: {result['open_ports_count']}")
        print(f"Vulnerable Ports: {result['vulnerable_ports_count']}")
        
        if result['ports']:
            print(f"\n{'Port':<8} {'Service':<15} {'Status':<10} {'Vulnerable':<12}")
            print("-" * 60)
            for port_info in result['ports']:
                vuln = "⚠️  YES" if port_info.get('vulnerable') else "✓ NO"
                print(f"{port_info['port']:<8} {port_info['service']:<15} "
                      f"{port_info['status']:<10} {vuln:<12}")
                
                if port_info.get('banner'):
                    banner_preview = port_info['banner'][:50].replace('\n', ' ')
                    print(f"         Banner: {banner_preview}...")
    
    def generate_report(self, results: List[Dict], output_file: str = None):
        """
        Generate a security report from scan results.
        
        Args:
            results: List of scan results
            output_file: Optional file path to save report
        """
        report = {
            'scan_date': datetime.now().isoformat(),
            'total_hosts_scanned': len(results),
            'hosts_up': len([r for r in results if r['status'] == 'up']),
            'total_open_ports': sum(r['open_ports_count'] for r in results),
            'total_vulnerable_ports': sum(r['vulnerable_ports_count'] for r in results),
            'hosts': results
        }
        
        # Print summary
        print(f"\n{'='*60}")
        print("SCAN SUMMARY")
        print(f"{'='*60}")
        print(f"Scan Date: {report['scan_date']}")
        print(f"Hosts Scanned: {report['total_hosts_scanned']}")
        print(f"Hosts Up: {report['hosts_up']}")
        print(f"Total Open Ports: {report['total_open_ports']}")
        print(f"Total Vulnerable Ports: {report['total_vulnerable_ports']}")
        
        # Security recommendations
        if report['total_vulnerable_ports'] > 0:
            print(f"\n{'='*60}")
            print("SECURITY RECOMMENDATIONS")
            print(f"{'='*60}")
            print("⚠️  Vulnerable ports detected! Consider:")
            print("   - Closing unnecessary ports")
            print("   - Using encrypted protocols (HTTPS, SFTP, SSH)")
            print("   - Implementing firewall rules")
            print("   - Regular security audits")
        
        # Save to file if specified
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"\n[+] Report saved to: {output_file}")
        
        return report


def main():
    """Main entry point for the scanner."""
    parser = argparse.ArgumentParser(
        description='Local Network Security Scanner',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Scan local network with default ports
  python network_scanner.py --network 192.168.1.0/24
  
  # Scan specific host
  python network_scanner.py --host 192.168.1.1
  
  # Scan with custom ports
  python network_scanner.py --network 192.168.1.0/24 --ports 22,80,443,8080
  
  # Auto-detect network and scan
  python network_scanner.py --auto
  
  # Save report to file
  python network_scanner.py --auto --output report.json
        """
    )
    
    parser.add_argument('--network', type=str, help='Network to scan (CIDR notation)')
    parser.add_argument('--host', type=str, help='Single host to scan')
    parser.add_argument('--ports', type=str, help='Comma-separated list of ports')
    parser.add_argument('--auto', action='store_true', help='Auto-detect local network')
    parser.add_argument('--timeout', type=float, default=1.0, help='Socket timeout (seconds)')
    parser.add_argument('--threads', type=int, default=50, help='Max concurrent threads')
    parser.add_argument('--output', type=str, help='Output file for JSON report')
    
    args = parser.parse_args()
    
    # Initialize scanner
    scanner = NetworkSecurityScanner(timeout=args.timeout, max_threads=args.threads)
    
    # Parse ports
    ports = None
    if args.ports:
        try:
            ports = [int(p.strip()) for p in args.ports.split(',')]
        except ValueError:
            print("[!] Invalid port format. Use comma-separated numbers (e.g., 22,80,443)")
            return
    
    # Determine target
    if args.host:
        # Scan single host
        print(f"[*] Scanning host: {args.host}\n")
        result = scanner.scan_host(args.host, ports)
        results = [result] if result['status'] == 'up' else []
        scanner.print_host_results(result)
    elif args.auto or args.network:
        # Scan network
        if args.auto:
            network = scanner.get_local_network()
            print(f"[*] Auto-detected network: {network}\n")
        else:
            network = args.network
        
        results = scanner.scan_network(network, ports)
    else:
        parser.print_help()
        return
    
    # Generate report
    if results:
        scanner.generate_report(results, args.output)
    else:
        print("\n[!] No hosts found or all hosts are down.")


if __name__ == '__main__':
    main()
